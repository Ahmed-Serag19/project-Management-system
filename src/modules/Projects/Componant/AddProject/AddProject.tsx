import axios from "axios";
import { Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Project_URLs } from "../../../../constants/End_Points";

type addProjuctInputs = {
    title: string,
    description: string
}

function AddProject() {
    const { register, handleSubmit, formState: { errors } } = useForm<addProjuctInputs>();

    const addNewProjuct = async (data: addProjuctInputs) => {
        try {
            const res = await axios.post<{ statusText: string }>(Project_URLs.addNewProject, data,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            if (res.statusText == 'Created') toast.success('Project Added Successfully')
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.log(error);
        }
    }

    return (
        <div>
            <div className="title-components ps-5 py-4 bg-white">
                <Link to={'/dashboard/projects'} className="text-decoration-none text-muted"><IoIosArrowBack /> View All Projects</Link>
                <h2 className="mt-2">Add a New Project</h2>
            </div>
            <div className="m-5 bg-white p-5 rounded-4 shadow">
                <form onSubmit={handleSubmit(addNewProjuct)}>
                    <div className="mb-5">
                        <Form.Group controlId="name">
                            <Form.Label className="text-muted">Enter project name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className="border rounded-4 p-2"
                                    type='text' placeholder="Title"
                                    {...register("title", { required: 'Project Title is required!' })}
                                />
                            </InputGroup>
                        </Form.Group>
                        {errors.title?.message && (
                            <p className="text-danger mt-1">{errors.title?.message}</p>
                        )}
                    </div>
                    <div className="mb-5">
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className="text-muted">Description</Form.Label>
                            <Form.Control
                                className="border rounded-4 p-2"
                                as="textarea"
                                placeholder="Description"
                                rows={3}
                                {...register("description", { required: 'Project description is required!' })}
                            />
                        </Form.Group>
                        {errors.description?.message && (
                            <p className="text-danger mt-1">{errors.description?.message}</p>
                        )}
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <Link to={'/dashboard/home'} className="text-decoration-none btn btn-outline-dark rounded-5 px-3">Cancel</Link>
                        <button className="text-white btn btn-warning rounded-5 px-3">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProject