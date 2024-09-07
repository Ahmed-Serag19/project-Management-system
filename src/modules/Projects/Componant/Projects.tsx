import axios from "axios";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { HiChevronUpDown } from "react-icons/hi2";
import { IoMdSearch } from "react-icons/io";
import { Project_URLs, requestHeader } from "../../../constants/End_Points";
import { Link, useNavigate } from "react-router-dom";
import NoData from "../../Shared/components/NoData/NoData";
import { Dropdown } from "react-bootstrap";
import CustomToggle from "../../Tasks/Componant/CustomToggle";
import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import PopupModal from "../../Shared/components/PopupModal/PopupModal";
import ViewProject from "./ViewProject/ViewProject";

interface Project {
  id: number;
  description: string;
  title: string;
  task: object[];
}

export default function Projects() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const closeDeleteModal = (): void => {
    setShowModal(false);
    setSelectedTaskId(null);
  };

  const openDeleteModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowModal(true);
  };

  const handleDeleteTask = async () => {
    if (selectedTaskId === null) return;

    setDeleting(true);
    try {
      await axios.delete(Project_URLs.deleteProject(selectedTaskId), {
        headers: requestHeader,
      });
      closeDeleteModal();
      toast.success("Task deleted successfully");
      getAllProjects(10, 1, "");
    } catch (error) {
      toast.error("Failed to delete task");
      closeDeleteModal();
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const getSearchValue = (e: any) => {
    console.log(e.target.value);
    getAllProjects(10, 1, e.target.value);
  };

  const getAllProjects = async (
    pageSize: number,
    pageNumber: number,
    title: string
  ) => {
    try {
      const params = {
        pageSize: pageSize,
        pageNumber: pageNumber,
        title: title,
      };
      const res = await axios.get(`${Project_URLs.getProjectForMang}`, {
        headers: requestHeader,
        params,
      });
      console.log(res?.data.data);

      setTotalNumberOfPages(
        Array.from(
          { length: res?.data?.totalNumberOfPages || 0 },
          (_, i) => i + 1
        )
      );
      setPageNumber(res?.data?.pageNumber);
      setProjectList(res?.data?.data);
    } catch (error: any) {
      toast.error(error.message || "Error fetching projects");
    }
  };

  useEffect(() => {
    getAllProjects(10, 1, "");
  }, []);

  return (
    <div>
      <div className="bg-white mt-1 d-flex justify-content-between align-items-center">
        <h2 className="title-components ps-5 py-4">Projects</h2>
        <button
          className="btn bg-main rounded-5 text-white px-4 me-4"
          onClick={() => navigate("/dashboard/add-project")}
        >
          + Add New Project
        </button>
      </div>

      <div className="m-5 mt-4 bg-white rounded-3 py-4">
        <InputGroup className="mb-3 ms-4 mt-2 border w-fit rounded-4 text-black">
          <InputGroup.Text id="basic-addon1">
            <IoMdSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search By Title"
            aria-label="Search By Title"
            aria-describedby="basic-addon1"
            className="text-black py-1"
            onChange={(e) => getSearchValue(e)}
          />
        </InputGroup>

        <div>
          <table className="table">
            <thead>
              <tr className="text-white">
                <th>
                  ID <HiChevronUpDown />
                </th>
                <th>
                  Title <HiChevronUpDown />
                </th>
                <th>
                  No Of Tasks <HiChevronUpDown />
                </th>
                <th>
                  Description <HiChevronUpDown />
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {projectList.length > 0 ? (
                projectList.map((Project) => {
                  return (
                    <tr key={Project.id}>
                      <td>{Project.id}</td>
                      <td>{Project.title}</td>
                      <td>{Project.task.length}</td>
                      <td>{Project.description}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle as={CustomToggle} />
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">
                              <FaEye />
                              <span className="d-inline-block ms-2">
                                <ViewProject
                                  projectId={Project.id}
                                  projectTitle={Project.title}
                                  projectDescription={Project.description}
                                  projectTasks={Project.task.length}
                                />
                              </span>
                            </Dropdown.Item>

                            <Dropdown.Item href="#">
                              <CiEdit />
                              <Link
                                to={`/dashboard/add-project/${Project.id}`}
                                className="text-black"
                                state={{ taskData: { Project }, type: "edit" }}
                              >
                                <span className="d-inline-block ms-2">
                                  Edit
                                </span>
                              </Link>
                            </Dropdown.Item>

                            <Dropdown.Item
                              href="#"
                              onClick={() => openDeleteModal(Project.id)}
                            >
                              <MdDelete />
                              <span className="d-inline-block ms-2">
                                Delete
                              </span>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <NoData />
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => getAllProjects(5, totalNumberOfPages[0], "")}
            />
            <Pagination.Prev
              onClick={() => getAllProjects(5, pageNumber - 1, "")}
            />

            {totalNumberOfPages?.map((num: number) => {
              return (
                <Pagination.Item
                  active={num === pageNumber}
                  key={num}
                  onClick={() => getAllProjects(5, num, "")}
                >
                  {num}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              onClick={() => getAllProjects(5, pageNumber + 1, "")}
            />
            <Pagination.Last
              onClick={() =>
                getAllProjects(
                  5,
                  totalNumberOfPages[totalNumberOfPages.length - 1],
                  ""
                )
              }
            />
          </Pagination>
        </div>

        <PopupModal
          buttonText="Delete"
          title="Delete Project Confirmation"
          bodyText="Are you sure you want to delete this project?"
          show={showModal}
          handleClose={closeDeleteModal}
          propFunction={handleDeleteTask}
          loading={deleting}
        />
      </div>
    </div>
  );
}
