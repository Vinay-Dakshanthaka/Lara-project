import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pagination, Modal, Button, Toast } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [studentsPerPage] = useState(10); // Number of students per page
  const [searchValue, setSearchValue] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); // Default search criteria
  const [batchDetails, setBatchDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:8080/api/student/getAllStudentDetails', config);
        // Filter out SUPER ADMIN students
        const filteredStudents = response.data.filter(student => student.role !== "SUPER ADMIN");
        setStudents(filteredStudents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = async (searchCriteria) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let searchUrl = '';
      let searchParam = '';

      // Determine the search URL and parameter based on the search criteria
      switch (searchCriteria) {
        case 'name':
          searchUrl = 'http://localhost:8080/api/student/searchByName';
          searchParam = 'name';
          break;
        case 'email':
          searchUrl = 'http://localhost:8080/api/student/searchByEmail';
          searchParam = 'email';
          break;
        case 'phoneNumber':
          searchUrl = 'http://localhost:8080/api/student/searchByPhoneNumber';
          searchParam = 'phoneNumber';
          break;
        default:
          return; // If invalid search criteria, exit function
      }

      // Check if the search value is empty
      if (!searchValue.trim()) {
        // If empty, fetch all students
        const response = await axios.get('http://localhost:8080/api/student/getAllStudentDetails', config);
        const filteredStudents = response.data.filter(student => student.role !== "SUPER ADMIN");
        setStudents(filteredStudents);
      } else {
        // If not empty, perform the search
        const response = await axios.get(searchUrl, {
          ...config,
          params: { [searchParam]: searchValue } // Pass the search value based on the search criteria
        });
        const filteredStudents = response.data;
        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBatchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:8080/api/student/getAllStudentsWithBatches', config);
      const filteredStudents = response.data.students.filter(student => student.role !== "SUPER ADMIN");
      setBatchDetails(filteredStudents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch batch details when component mounts
    fetchBatchDetails();
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddToBatch = (student) => {
    setSelectedStudent(student);
    setSelectedBatches([]);
    setShowModal(true);
  };

  const handleCheckboxChange = (event) => {
    const batchId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedBatches(prevState => [...prevState, batchId]);
    } else {
      setSelectedBatches(prevState => prevState.filter(id => id !== batchId));
    }
  };

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post('http://localhost:8080/api/student/assignBatchesToStudent', {
        studentId: selectedStudent.id,
        batchIds: selectedBatches,

      }, config);
      console.log(response.data);
      setShowModal(false);
      setShowSuccessToast(true);
      fetchBatchDetails();
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };



  const [availableBatches, setAvailableBatches] = useState([]);

  const fetchAvailableBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:8080/api/student/getAllBatches', config);
      setAvailableBatches(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAvailableBatches();
  }, []);

  const createBatch = () => {
    navigate('/createNewBatch')
  }
  const deassignBatch = async (studentId, batchId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        'http://localhost:8080/api/student/deassignBatchesFromStudent',
        {
          studentId,
          batchIds: [batchId],
        },
        config
      );
      console.log(response.data);
      console.log('Successfully deleted');

      // Update batch details after successful removal
      fetchBatchDetails();
    } catch (error) {
      console.error('Error deassigning batch:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h1>All Student Details</h1>
      <div className="mb-3 row align-items-center">
        <div className="col-md-3 mb-2 mb-md-0">
          <select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            className="form-select"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone Number</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search by ${searchCriteria}...`}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <button onClick={() => handleSearch(searchCriteria)} className="btn btn-primary">Search</button>
        </div>
        <div className="col-md-3">
          <button onClick={createBatch} className="btn btn-primary m-2">Create New Batch</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Batches</th>
            <th>Add to Batch</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
  {batchDetails
    .filter(batchStudent => batchStudent.id === student.id)
    .map(batchStudent => (
      <ul key={batchStudent.id}>
        {batchStudent.batches.map(batch => (
          <li key={batch.batch_id}>
            <div className="d-flex align-items-center justify-content-between">
              <span>{batch.batch_name}</span>
              <button className="btn btn-danger ms-2 m-1" onClick={() => deassignBatch(student.id, batch.batch_id)}>
                <BsTrash/>
              </button>
            </div>
          </li>
        ))}
      </ul>
    ))}
</td>


              <td>
                <button className='btn btn-primary' onClick={() => handleAddToBatch(student)}>Add to Batch</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='text-center'>
        <Pagination>
          {studentsPerPage !== 0 &&
            Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
        </Pagination>
      </div>
      {/* Add to Batch Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <p>Name: {selectedStudent.name}</p>
              <p>Email: {selectedStudent.email}</p>
              <p>Phone Number: {selectedStudent.phoneNumber}</p>
              <div>
                <h6>Select Batches:</h6>
                {availableBatches.map(batch => (
                  <div key={batch.batch_id} className="form-check">
                    <input className="form-check-input" type="checkbox" value={batch.batch_id} onChange={handleCheckboxChange} />
                    <label className="form-check-label">{batch.batch_name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
      {/* Success Toast */}
      <Toast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 mt-2 me-2"
        style={{ backgroundColor: 'rgba(40, 167, 69, 0.85)', color: 'white' }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Batches assigned successfully</Toast.Body>
      </Toast>

      {/* Error Toast */}
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 mt-2 me-2"
        style={{ backgroundColor: 'rgba(220, 53, 69, 0.85)', color: 'white' }}
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Failed to assign batches</Toast.Body>
      </Toast>

    </div>
  );
};

export default StudentDetails;
