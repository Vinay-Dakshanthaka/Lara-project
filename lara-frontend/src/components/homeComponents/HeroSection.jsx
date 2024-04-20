import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import defaultProfileImage from "../default-profile.png";
import { baseURL } from '../config';
import Carousel from 'react-bootstrap/Carousel';

const HeroSection = () => {
  const [homeContent, setHomeContent] = useState(null);
  const [bestPerformer, setBestPerformer] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchHomeContent();
    fetchBestPerformer();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
      const data = response.data[0];
      setHomeContent(data);
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
  };

  const fetchBestPerformer = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`);
      const data = response.data;
      setBestPerformer(data);
      console.log(" best performer : ", bestPerformer)
      console.log("data :",data)

      const performerImages = await Promise.all(data.map(async (performer) => {
        try {
          const response = await axios.post(`${baseURL}/api/student/getProfileImageFor`, { id: performer.student.id }, {
            responseType: 'arraybuffer',
          });
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
          return `data:${response.headers['content-type']};base64,${base64Image}`;
        } catch (error) {
          console.error('Error fetching profile image:', error);
          return defaultProfileImage;
        }
      }));

      setImages(performerImages);
    } catch (error) {
      console.error('Error fetching best performer:', error);
    }
  };

  const splitBySingleSpace = (text) => {
    return text.split(/\s+/).filter(Boolean);
  };

  return (
    <Container className="my-4">
      <Row>
        {/* Schedule Section */}
        <Col md={6} >
          <div className="schedule-section card p-3">
            <h2 className="display-6">Today's Schedule</h2>
            <ListGroup>
              {homeContent && splitBySingleSpace(homeContent.today_schedule).map((url, index) => (
                <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
              ))}
            </ListGroup>
            <h2 className="mt-5 mb-4 display-6">Tomorrow's Schedule</h2>
            <ListGroup>
              {homeContent && splitBySingleSpace(homeContent.tomorrow_schedule).map((url, index) => (
                <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
        {/* Best Performer Section */}
        <Col md={6}>
          <div className="best-performer-section d-flex align-items-center justify-content-center flex-column p-3">
            <h2>Best Performers</h2>
            {bestPerformer.length > 0 ? (
            <Carousel nextIcon={<span className="carousel-control-next-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />} prevIcon={<span className="carousel-control-prev-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />}>
            {bestPerformer.map((performer, index) => (
              <Carousel.Item key={index}>
                <p className='text-center'> Assignement No : {performer.bestPerformers[index].question_no || ' '}</p>
                <div className="text-center mt-4">
                  <img src={images[index] || defaultProfileImage} alt="Best Performer" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
                  {performer.profile ? (
                    <>
                      <p className="my-2 display-4">{performer.student.name}</p>
                      <p className="my-2 h6">{performer.collegeName || ' '}</p>
                      <p className="my-2 h6">
                        {performer.profile.highest_education || ' '}
                        {performer.profile.highest_education && performer.profile.specialization && ', '}
                        {performer.profile.specialization || ' '}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="my-2 display-4">{performer.student.name}</p>
                      <p className="my-2 h6">{performer.collegeName || ' '}</p>
                      <p className="my-2 h6"> </p>
                    </>
                  )}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          
            ) : (
              <div className="text-center mt-4">
                <img src={defaultProfileImage} alt="Default Profile" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
                <p className="my-2 h6">Best performer data not available</p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;
