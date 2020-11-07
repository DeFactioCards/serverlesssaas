import { db } from 'config/firebase';
import Link from 'next/link';

const ListItem = (page, children) => {
  const deletePage = (pageId) => {
    db.collection('projects')
      .doc(page.projectId)
      .collection('pages')
      .doc(pageId)
      .delete()
      .then(function () {
        console.log('Document successfully deleted!');
      })
      .catch(function (error) {
        console.error('Error removing document: ', error);
      });
  };

  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium leading-5 text-gray-900 whitespace-no-wrap">
        {page.name}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap">
        /docs/{page.slug}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap">
        {page.section || 'None'}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap">
        {page.order}
      </td>
      <td className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap">
        <button
          type="button"
          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline sm:text-sm sm:leading-5"
          onClick={() => deletePage(page.id)}
        >
          Delete
        </button>
      </td>
      <td className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap">
        <Link href={`/projects/${page.projectId}/pages/${page.id}/edit`}>
          <a href="" className="text-indigo-600 hover:text-indigo-900">
            Edit
          </a>
        </Link>
      </td>
    </tr>
  );
};

export default ListItem;
