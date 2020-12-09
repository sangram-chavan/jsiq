import { Layout } from 'components/Layout';
import { FrontMatter, getAllQuestions, getQuestionBySlug } from 'utils/getQuestions';
import { GetStaticProps } from 'next';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';

import MDXComponents from 'components/mdComponents';
import { Sidebar } from 'components/Sidebar/Sidebar';

interface Props {
  source: string;
  frontMatter: FrontMatter;
}

export default function Overview({ source, frontMatter }: Props) {
  const content = hydrate(source, { components: MDXComponents });

  return <Layout sidebar={<Sidebar />}>{content}</Layout>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const question: any = getQuestionBySlug(params.id);

  const mdxSource = await renderToString(question.content, {
    components: MDXComponents,
    scope: question.data,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: question.data,
    },
  };
};

export async function getStaticPaths() {
  const questions = getAllQuestions();

  return {
    paths: questions.map((item: any) => {
      return {
        params: {
          id: `${item.data.id}`,
        },
      };
    }),
    fallback: false,
  };
}
