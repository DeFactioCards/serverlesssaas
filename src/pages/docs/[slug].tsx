import SideBar from 'components/home/SideBarLayout';
import { db } from 'config/firebase';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import ReactMarkdown from 'react-markdown';

const HomePage: NextPage<any> = ({ pages, currentPage }) => {
  return (
    <SideBar pages={pages}>
      <main
        className="relative z-0 flex-1 overflow-y-auto focus:outline-none"
        tabIndex={0}
      >
        <div className="p-8">
          <div className="px-4 mx-auto prose max-w-7xl sm:px-6 md:px-8">
            <ReactMarkdown source={currentPage.content} />
          </div>
        </div>
      </main>
    </SideBar>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log(params);
  const pages = [];
  let currentPage = {};

  await db
    .collection('projects')
    .doc('serverless-saas')
    .collection('pages')
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        if (doc.exists) {
          pages.push({ id: doc.id, ...doc.data() });
          if (doc.data().slug === params.slug) {
            currentPage = { id: doc.id, ...doc.data() };
          }
        }
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  return { props: { pages, currentPage } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = [];

  await db
    .collection('projects')
    .doc('serverless-saas')
    .collection('pages')
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        if (doc.exists) {
          pages.push({ id: doc.id, ...doc.data() });
        }
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  const paths = pages.map((page) => {
    return `/docs/${page.slug}`;
  });

  return {
    paths,
    fallback: false,
  };
};

export default HomePage;
