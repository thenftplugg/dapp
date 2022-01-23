import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { buildRoute } from '../auth/client/routes';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Line } from 'react-chartjs-2';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';

const TENSION = 0.1;

const StatisticsPanel = ({name, count, weekCount, x, y}) => {
  return (
    <Card className="my-3 p-3">
      <Card.Body>
        <Row>
          <Col className="text-center">
            <h3 class="mb-0">{count}</h3>
            <h6 className="text-muted font-weight-normal">
              Total {name}
            </h6>
          </Col>
          <Col className="text-center">
            <h3 class="mb-0 text-success">+{weekCount}</h3>
            <h6 className="text-muted font-weight-normal">
              New {name}
            </h6>
          </Col>
        </Row>
        <div>
          <Line
            datasetIdKey='id'
            options={{
              plugins: { legend: { display: false } }
            }}
            data={{
              labels: x.sort((a, b) => a - b).map(d => d.toLocaleString('en-us', {  weekday: 'long' })),
              datasets: [
                {
                  id: 2,
                  label: '',
                  data: y,
                  fill: true,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: TENSION
                },
              ],
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
export default function Playground() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(buildRoute("/editor/statistics")).then((response) => {
      setStats(response.data)
      setLoading(false);
    });
  }, []);
  return (
    <div>
      <Navbar /> 
      <Container className="page-body-wrapper mt-5">
        <div className="display-1 mb-4">
          Statistics for Raremints
        </div>
        {!loading && (
          <div>
            <StatisticsPanel
              name="Artists"
              count={stats.artists.count}
              weekCount={stats.artists.week_count}
              x={stats.artists.stats.map(s => new Date(s.day))}
              y={stats.artists.stats.map(s => s.c)}
            />
            <StatisticsPanel
              name="Projects"
              count={stats.projects.count}
              weekCount={stats.projects.week_count}
              x={stats.projects.stats.map(s => new Date(s.day))}
              y={stats.projects.stats.map(s => s.c)}
            />
            <StatisticsPanel
              name="Images"
              count={stats.images.count}
              weekCount={stats.images.week_count}
              x={stats.images.stats.map(s => new Date(s.day))}
              y={stats.images.stats.map(s => s.c)}
            />
          </div>
        )}

        <Footer nocontainer={true} />
      </Container>
    </div>
  );
}