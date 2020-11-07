import SideBar from 'components/home/SideBarLayout';
import { db } from 'config/firebase';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage<any> = ({ pages }) => {
  return (
    <SideBar pages={pages}>
      <main
        className="relative z-0 flex-1 overflow-y-auto focus:outline-none"
        tabIndex={0}
      >
        <div className="pt-2 pb-6 md:py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            {pages?.map((page) => (
              <Link
                href={`/projects/${page.slug}/pages/${page.slug}`}
                key={page.slug}
              >
                <a
                  href=""
                  className="flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-gray-100 rounded-md group hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
                >
                  {/* Heroicon name: home */}
                  <svg
                    className="w-6 h-6 mr-3 text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {page.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </SideBar>
  );
};

export const getStaticProps: GetStaticProps = async () => {
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

  return { props: { pages } };
};

export default HomePage;
