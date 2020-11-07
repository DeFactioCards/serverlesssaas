import { useRequireAuth } from 'hooks/useRequireAuth';
import Layout from 'components/dashboard/Layout';
import BreadCrumbs from 'components/dashboard/BreadCrumbs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { GetServerSideProps } from 'next';
import { db } from 'config/firebase';
import Link from 'next/link';
import Button from 'components/elements/Button';
import { arrayMove } from 'utils/arrayMove';
import { useState } from 'react';

const ProjectPage: React.FC<any> = ({ project, sortedPages }) => {
  const { user } = useRequireAuth();
  const [pages, setPages] = useState(sortedPages);
  if (!user) return null;

  const breadCrumbs = {
    back: {
      path: '/projects',
      text: 'Back',
    },
    first: {
      path: '/projects',
      text: 'projects',
    },
    second: {
      path: '/projects/serverless-saas',
      text: project.name,
    },
  };

  const onDragEnd = async (result) => {
    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    const newArray = arrayMove(project.sortedPageIds, oldIndex, newIndex);
    sortPages(newArray);

    const projectRef = db.collection('projects').doc(project.id);
    await projectRef
      .update({ sortedPageIds: newArray })
      .then(function () {
        console.log('Document successfully updated!');
      })
      .catch(function (error) {
        console.error('Error updating document: ', error);
      });
  };

  const sortPages = (ids) => {
    const sortedPages = [];
    ids.map((id) => {
      const page = pages.find((page) => page.id === id);
      sortedPages.push(page);
    });
    setPages(sortedPages);
  };

  return (
    <Layout>
      <div className="max-w-6xl px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                {project.name}
              </h2>
            </div>
            <Link href={`/projects/${project.id}/pages/new`}>
              <a href="">
                <Button title="New page" />
              </a>
            </Link>
          </div>
        </header>
        <div className="bg-white rounded-lg shadow ">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                          Section
                        </th>
                        <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                          Order
                        </th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                      </tr>
                    </thead>
                    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <tbody
                            className="bg-white divide-y divide-gray-200"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {pages?.map((page, index) => (
                              <Draggable
                                key={page.id}
                                draggableId={page.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
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
                                      <Link
                                        href={`/projects/${project.id}/pages/${page.id}/edit`}
                                      >
                                        <a
                                          href=""
                                          className="text-indigo-600 hover:text-indigo-900"
                                        >
                                          Edit
                                        </a>
                                      </Link>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const pages = [];
  let project = {};

  const docRef = db.collection('projects').doc(params.projectId);

  await docRef.get().then(function (doc) {
    if (doc.exists) {
      project = { id: doc.id, ...doc.data() };
    }
  });

  await docRef
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

  const sortedPages = [];
  project?.sortedPageIds?.map((id) => {
    const page = pages.find((page) => page.id === id);
    console.log('page:', page);
    sortedPages.push(page);
  });

  sortedPages.filter((n) => n);

  return {
    props: { project, sortedPages: sortedPages.length ? sortedPages : pages },
  };
};

export default ProjectPage;
