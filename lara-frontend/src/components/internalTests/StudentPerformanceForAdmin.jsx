import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Spinner, Badge } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { useParams } from 'react-router-dom';

const StudentPerformanceForAdmin = () => {
    const { student_id } = useParams(); // Get student_id from URL
    const [performance, setPerformance] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log('student id from params ', student_id)
    useEffect(() => {
        fetchPerformanceData();
        fetchStudentDetails();
    }, []);

    const fetchPerformanceData = async () => {
        try {

            const response = await axios.post(`${baseURL}/api/internal-test/getStudentPerformanceForAdmin`,
                { student_id },
            );
            console.log("student performance data ", response.data)
            setPerformance(response.data.performance);
        } catch (error) {
            console.error('Error fetching performance data:', error);
            toast.error('Error fetching performance data');
        }
    };

    const fetchStudentDetails = async () => {
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

            const response = await axios.post(`${baseURL}/api/student/getStudentDetailsById`,
                {
                    id: student_id
                }, config
            );
            console.log("student : ", response.data)
            setStudentDetails(response.data.student);
        } catch (error) {
            console.error('Error fetching student details:', error);
            toast.error('Error fetching student details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (!performance || !studentDetails) {
        return <div>No data found.</div>;
    }

    const pieData = [
        { name: 'Marks Obtained', value: performance.total_marks_obtained },
        { name: 'Total Marks Lost', value: performance.total_possible_marks - performance.total_marks_obtained },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    // Calculate overall performance percentage
    const performancePercentage = (performance.total_marks_obtained / performance.total_possible_marks) * 100;

    // Determine the performance level
    const performanceLevel = performancePercentage >= 75 ? "Great" :
        performancePercentage >= 50 ? "Good" : "Needs Improvement";

    // Get the latest 3 test results
    const latestTestResults = performance.test_results.slice(-3);

    return (
        <Container className="mt-5">
            <h2 className='text-center'>Student Performance Overview</h2>

            {/* Student Details */}
            <Row className="mt-4">
                <Col>
                    <h4>Student Details</h4>
                    <Table striped border hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email </th>
                                <th>Phone Number </th>
                            </tr>
                        </thead>
                        <tbody>
                            <td className='lead fw-bold'>{studentDetails.name}</td>
                            <td className='lead fw-bold'>{studentDetails.email}</td>
                            <td className='lead fw-bold'>{studentDetails.phoneNumber}</td>
                        </tbody>

                    </Table>
                </Col>
            </Row>

            {/* Overall Performance Summary */}
            <Row className="text-center mt-4">
                <Col>
                    <h4>Overall Performance</h4>
                    <h3>
                        <Badge pill bg={performancePercentage >= 75 ? "success" : performancePercentage >= 50 ? "warning" : "danger"}>
                            {performanceLevel}
                        </Badge>
                    </h3>
                    <p>You have scored {performance.total_marks_obtained} out of {performance.total_possible_marks} total marks ({performancePercentage.toFixed(2)}%)</p>
                </Col>
            </Row>

            {/* Toast Notification */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

            {/* Performance Summary Table */}
            <Row className="mt-5">
                <Col>
                    <h4>Performance Summary</h4>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Total Tests Attended</th>
                                <th>Total Marks Obtained</th>
                                <th>Total Possible Marks</th>
                                <th>Average Score per Test</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{performance.total_tests_attended}</td>
                                <td>{performance.total_marks_obtained}</td>
                                <td>{performance.total_possible_marks}</td>
                                <td>{performance.average_score_per_test}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row className="mt-4">
                {/* Pie Chart */}
                <Col md={6}>
                    <h4>Marks Distribution</h4>
                    <p>This chart shows how marks are distributed across total possible marks.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>

                {/* Bar Chart */}
                <Col md={6}>
                    <h4>Latest 3 Test Performances</h4>
                    <p>This bar chart shows performance in the latest 3 tests. Hover to see the details.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={latestTestResults}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="test_description" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="marks_obtained" fill="#0088FE" name="Marks Obtained" />
                            <Bar dataKey="total_marks" fill="#FF8042" name="Total Marks" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentPerformanceForAdmin;
