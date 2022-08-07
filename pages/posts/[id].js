import Head from "next/head";
import { getAllPostIds, getPostData } from "../../lib/post";
import Layout from "../components/Layout";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticPaths() {
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false, //pathsに含まれていないパスにアクセスすると404エラーとなる
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export default function Post(postData) {
  return (
    <Layout>
      <Head>
        <title>{postData.postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingX1}>{postData.postData.title}</h1>
        <div className={utilStyles.lightText}>{postData.postData.date}</div>

        <div
          dangerouslySetInnerHTML={{
            __html: postData.postData.blogContentHTML,
          }}
        />
      </article>
    </Layout>
  );
}
