import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout, { siteTitle } from "./components/Layout";

import Link from "next/link";
import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "../lib/post";

//SSGの場合
export async function getStaticProps() {
  const allPostsData = getPostsData(); //id,title,date,thumbnail

  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyle.headingMd} `}>
          <p>React勉強中!日々の勉強などなどを記載していきます。</p>
        </section>

        <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
          <h2>📝エンジニアのブログ</h2>
          <div className={styles.grid}>
            {allPostsData.map(({ id, title, date, thumbnail }) => {
              console.log(id, title, date, thumbnail);
              return (
                <article key={id}>
                  <Link href={`/posts/${id}`}>
                    <img
                      src={`${thumbnail}`}
                      alt="サムネイル画像"
                      className={styles.thumbnailImage}
                    />
                  </Link>
                  <Link href={`/posts/${id}`}>
                    <a className={utilStyle.boldText}>{title}</a>
                  </Link>
                  <br />
                  <small className={utilStyle.lightText}>{date}</small>
                </article>
              );
            })}
          </div>
        </section>
      </Layout>
    </>
  );
}
