import Head from "next/head";
import Layout from "../components/Layout";
import utilStyles from "../../styles/utils.module.css";
import { db } from "../../src/firebase";
import { useRouter } from "next/router";

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

export const getStaticPaths = async () => {
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

  const paths = blogDocuments.map((blogDocument) => ({
    params: {
      id: blogDocument.id.toString(),
    },
  }));
  return { paths, fallback: false };
};

export default function Post(blogDocuments) {
  const router = useRouter();
  const urlId = router.query.id;
  let countNum = 0;
  let flgNum = 0;
  const targetId = blogDocuments.blogDocuments.map((blogDocument) => {
    countNum++;
    if (blogDocument.id === urlId) {
      flgNum = countNum;
      return blogDocument;
    }
  });

  const targetObj = targetId[flgNum - 1];
  return (
    <Layout>
      <Head>
        <title>{targetObj.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingX1}>{targetObj.title}</h1>
        <div className={utilStyles.lightText}>{targetObj.date}</div>
        <div>{targetObj.article}</div>
      </article>
    </Layout>
  );
}
