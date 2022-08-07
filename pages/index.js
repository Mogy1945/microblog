import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout, { siteTitle } from "./components/Layout";

import Link from "next/link";
import utilStyle from "../styles/utils.module.css";

import React, { useState, useEffect } from "react";
import { db } from "../src/firebase";

export async function getStaticProps() {
  const blogDocuments = [];
  const ref = await db.collection("blog-documents").get();
  ref.docs.map((doc) => {
    const data = {
      id: doc.id,
      title: doc.data().title,
      thumbnail: doc.data().thumbnail,
      date: doc.data().date,
      article: doc.data().article,
    };
    blogDocuments.push(data);
  });
  return {
    props: {
      blogDocuments,
    },
  };
}

export default function Home({ blogDocuments }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [article, setArticle] = useState("");

  const [documents, setDocuments] = useState([
    { id: "", title: "", thumbnail: "", date: "", article: "" },
  ]);
  useEffect(() => {
    const unSub = db.collection("blog-documents").onSnapshot((snapshot) => {
      setDocuments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          thumbnail: doc.data().thumbnail,
          date: doc.data().date,
          article: doc.data().article,
        }))
      );
    });

    return () => unSub();
  }, []);

  const newArticle = () => {
    db.collection("blog-documents").add({
      title: title,
      date: date,
      thumbnail: thumbnail,
      article: article,
    });
    setTitle("");
    setDate("");
    setThumbnail("");
    setArticle("");
  };

  const deleteArticle = (e) => {
    const deletTarget = e.currentTarget.dataset.docid;
    db.collection("blog-documents").doc(deletTarget).delete();
  };

  return (
    <>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyle.headingMd} `}>
          <p>React勉強中!日々の勉強などなどを記載していきます。</p>
        </section>
        <div>
          <p>タイトル</p>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p>日付</p>
          <input
            type="text"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <p>サムネイル画像のパス</p>
          <input
            type="text"
            onChange={(e) => {
              setThumbnail(e.target.value);
            }}
          />
          <p>本文</p>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            onChange={(e) => {
              setArticle(e.target.value);
            }}
          ></textarea>
          <button onClick={newArticle}>投稿する</button>
        </div>
        <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
          <h2>📝エンジニアのブログ</h2>
          <div className={styles.grid}>
            {documents.map((document) => {
              return (
                <article key={document.title}>
                  <button data-docId={document.id} onClick={deleteArticle}>
                    この記事を削除する
                  </button>
                  <Link href={`/posts/${document.id}`}>
                    <img
                      src={`${document.thumbnail}`}
                      alt="サムネイル画像"
                      className={styles.thumbnailImage}
                    />
                  </Link>
                  <Link href={`/posts/${document.id}`}>
                    <a className={utilStyle.boldText}>{document.title}</a>
                  </Link>
                  <br />
                  <small className={utilStyle.lightText}>{document.date}</small>
                </article>
              );
            })}
          </div>
        </section>
      </Layout>
    </>
  );
}
