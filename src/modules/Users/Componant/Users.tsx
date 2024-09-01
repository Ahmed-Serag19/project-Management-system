import { useEffect, useState } from "react";
import styles from './Users.module.css'
import { HiChevronUpDown } from "react-icons/hi2";
import axios from "axios";
import { requestHeader, User_URls } from "../../../constants/End_Points";
import NoData from "../../Shared/components/NoData/NoData";
import { toast } from "react-toastify";

export default function Users() {
  const [userList, setUserList] = useState([]);
  const [nameValue, setNameValue] = useState<string>("");
  const [groupValue, setGroupValue] = useState(1);
  // const [arrayOffPages, setArrayOffPages] = useState<any>([]);
  // type pagesData={
  //   totalNumberOfPages:number;
  // }
  const arrayOfPages = Array.from({ length: 20 }, (_, i) => i + 1);
  const filteredPages = arrayOfPages.filter(
    (pageN) => pageN >= 1 && pageN <= 10
  );

  let getAllUsers = async (
    pageS?: number,
    pageN?: number,
    nameInput?: string,
    groupsInput?: number
  ) => {
    try {
      let response = await axios.get(User_URls.getUser, {
        headers: requestHeader,
        params: {
          pageSize: pageS,
          pageNumber: pageN,
          userName: nameInput,
          groups: groupsInput,
        },
      });
      // setArrayOffPages(Array(response.data.totalNumberOfPages).fill().map((_,i)=>i+1))
      setUserList(response.data.data);

      console.log(response);
    } catch (error:any) {
      console.log(error);
     
     
    }
  };
  let getToggle = async (id: string) => {
    try {
      let response = await axios.put(
        User_URls.toggleStatues(id),
        {},
        {
          headers: requestHeader,
        }
      );
      console.log(response);

      getAllUsers(8,1,"", 1);
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  };

  //   const pages=(currentPage:number, totalNumberOfPages:any)=>{
  // if (currentPage == arrayOffPages[0]) {
  //   if(currentPage-10<=0){
  //     if(currentPage+11 >= 11){
  //       return range(1,11)
  //     }else{
  //       return range(1,arrayOffPages?.length)
  //     }

  //   }
  //   return range(currentPage -10, currentPage-1)

  // }
  // if (currentPage-10> totalNumberOfPages){
  //   return range (totalNumberOfPages-1,totalNumberOfPages-10) }

  // }
  // return range(currentPage,currentPage+10)

  //   }

  useEffect(() => {
    getAllUsers(8, 1,"", 1);
  }, []);

  const getNameValue = (input: any) => {
    setNameValue(input.target.value);
    getAllUsers(8,1,input.target.value,groupValue);
  };
  const getGroupValue = (input: any) => {
    setGroupValue(input.target.value);
    getAllUsers(8, 1,nameValue,input.target.value);
  };

  return (
    <>
      <h2 className="title-components ps-5 py-4 bg-white mb-5">User</h2>

      <div className="mx-5 mb-5 pt-1 rounded-2 bg-white">
      <div className="mb-3 ms-3 mt-4 pt-2 d-flex ">
              <div className="col-md-3 me-3 mb-1">
                <div className="input-group border-1 mb-2  p-1 border rounded-pill">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control inputForm gray"
                    placeholder="Search by name"
                    onChange={getNameValue}
                  />
                </div>
              </div>

              <div className=".col-md-2 pe-2">
                <select
                  onChange={getGroupValue}
                  className=" text-black border rounded-pill py-2 px-2 "
                >
                  <option value=""> Filter</option>
                  <option value="1">Manager</option>
                  <option value="2">Employee</option>
                </select>
              </div>
            </div>
        {userList.length > 0 ? (
          <div>
       

            <table className="table col-md-11">
              <thead>
                <tr className="text-white text-start ">
                  <th scope="col-2 " className="ms-3">
                    {" "}
                    User Name <HiChevronUpDown />{" "}
                  </th>
                  <th scope="col">
                    Statues <HiChevronUpDown />
                  </th>
                  <th scope="col">
                    Phone Number <HiChevronUpDown />
                  </th>
                  <th scope="col-2">
                    Email <HiChevronUpDown />
                  </th>
                  <th scope="col">
                    Date Created <HiChevronUpDown />
                  </th>
                  <th scope="col">
                    Action <HiChevronUpDown />
                  </th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user: any) => (
                  <tr key={user.id}>
                    <td>{user.userName}</td>
                    <td>
                      {user.isActivated ? (
                        <button className="btn btn-hover btn-success rounded-pill ">
                          Active
                        </button>
                      ) : (
                        <button className="btn btn-hover btn-danger rounded-pill ">
                          Not Active
                        </button>
                      )}
                    </td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user?.creationDate).toLocaleDateString()}</td>
                    <td>
                      {user?.isActivated ? (
                        <i
                          className="fa fa-toggle-on fa-3x text-success"
                          onClick={() => getToggle(user.id)}
                        ></i>
                      ) : (
                        <i
                          className="fa  fa-toggle-off fa-3x text-danger"
                          onClick={() => getToggle(user.id)}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pb-1 my-2 me-4">
              <nav aria-label="Page navigation example ">
                <ul className="pagination  justify-content-end">
                  <li className="page-item">
                    <a className="page-link" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>

                  {filteredPages.map((pageN: number) => (
                    <li
                      onClick={() => getAllUsers(8, pageN)}
                      className="page-item"
                      key={pageN}
                    >
                      <a className="page-link">{pageN}</a>
                    </li>
                  ))}

                  {/*
    {arrayOffPages.map((pageN)=>(
   <li onClick={()=> getUsers(10,pageN)} className="page-item" key={pageN}>
     <a className="page-link" href="#">{pageN} <span className="sr-only">(current)</span></a></li>
    ))}  */}

                  <li className="page-item">
                    <a className="page-link" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
