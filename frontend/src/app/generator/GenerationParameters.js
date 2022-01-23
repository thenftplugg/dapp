import React, { useRef, useState } from 'react';
import { Row, Col, Form, Button, ProgressBar } from 'react-bootstrap'
import { Generator } from './utils';
import Advanced from './Advanced';
import CandyMachineSettings from './CandyMachineSettings';
import ChooseBlockchain from './ChooseBlockchain';
import ClipLoader from "react-spinners/ClipLoader";
import ProgressBarEta from "./ProgressBarEta";


const createNumByGroupIdForOneGroupProject = (project, val) => {
  let numByGroupId = {};
  numByGroupId[project.groups[0].id] = parseInt(val, 10);
  return numByGroupId
}

export default function GenerationParameters({project}) {
const [params, setParams] = useState({
  total: 10000,
  target: 'erc721',
  extra: {},
  numByGroupId: project.groups.length === 1 ? createNumByGroupIdForOneGroupProject(project, 10000) : {}
});
const [isDone, setIsDone] = useState(false);
const validate = () => {
  const newErrors = {};
  const total = Object.values(params.numByGroupId).reduce((partial_sum, a) => partial_sum + a,0);
  if (total != params.total) {
    newErrors.doesNotAddUp = `Groups have to add to ${params.total}`;
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

const [image, setImage] = useState([]);
const [errors, setErrors] = useState({});
const [generating, setGenerating] = useState(false);
const [loading, setLoading] = useState(false);
const [progress, setProgress] = useState(0);
const progressRef = useRef(progress);
const [total, setTotal] = useState(1);

const generate = () => {
  setLoading(true);
  setGenerating(true);
  const total = Object.values(params.numByGroupId).reduce((partial_sum, a) => partial_sum + a, 0);
  setTotal(total);
  const g = new Generator(project, params.numByGroupId, {
    generateInBatches: params.generateInBatches,
  });

  g.setCallbacks({
    drewOneImage: (dataUrl) => {
      setLoading(false);
      progressRef.current += 1;
      setProgress(progressRef.current);
      setImage(dataUrl);
    },
    complete: () => {
      setIsDone(true);
    }
  })

  g.build(params.target, params.extra);
}
return (
  <div className="mt-5">
    <div className="display-2 mb-4">
      {project.name}
    </div>
    <Row>
      <Col>
        <div className="display-4 mb-3">
          How many unique images do you want to generate?
        </div>
      </Col>
      <Col md="auto">
        <Form.Group className="mb-3" controlId="project-name">
          <Form.Control
            size="lg"
            type="number"
            onChange={(e) => {
              if (project.groups.length === 1) {
                const numByGroupId = createNumByGroupIdForOneGroupProject(project, e.target.value);
                setParams({...params, total: e.target.value, numByGroupId: numByGroupId});
              } else {
                setParams({...params, total: e.target.value});
              }
            }}
            value={params.total}
            placeholder="10000"
          />
        </Form.Group>
      </Col>
    </Row>

    <hr/>
    <hr/>

    {project.groups.length > 1 && project.groups.map(group => {
      return (
        <Row>
          <Col>
            <div className="display-5 mb-3">
              How many from group {group.name}?
            </div>
          </Col>
          <Col md="auto">
            <Form.Group className="mb-3" controlId="project-name">
              <Form.Control type="number" onChange={(e) => {
                const newParams = {...params};
                newParams.numByGroupId[group.id] = parseInt(e.target.value, 10);
                setParams(newParams);
              }} value={params.numByGroupId[group.id] || 0} />
            </Form.Group>
          </Col>
        </Row>
      );
    })}
    <div className="text-danger text-right">{errors.doesNotAddUp}</div>
    <ChooseBlockchain params={params} setParams={setParams} />

    { params.target === 'candy_machine' && (
      <CandyMachineSettings params={params} setParams={setParams} />
    ) }

    {loading && (
      <div className="text-center my-4">
        <ClipLoader color="#8f5fe8" loading={loading} size={50} />
      </div>
    )}
    {image && (
      <div className="text-center">
        <img width="250" className="shadow-lg rounded-lg my-2" src={image} />
      </div>
    )}
    <Advanced params={params} setParams={setParams} />

    
    { generating && <ProgressBarEta progress={progress} total={total} /> }
    {!isDone && (
      <Button
        block
        disabled={generating}
        variant="success"
        className="mt-3 large-button"
        size="lg"
        type="submit"
        onClick={() => {
          if (validate()) {
            generate()
          }
        }}>
        { !generating && "Generate!" }
        { generating && "Working hard... Don't leave this page!" }
        </Button>
      )}
      {generating && (
        <div className="mt-3 text-muted">
          If your browser freezes when generating images, try using <b>Advanced</b> <i className="mdi mdi-arrow-right"></i> <b>Generate in Batches</b>
        </div>
      )}
      {isDone && (
        <div className="text-success text-center">
          <i className="display-2 mdi mdi-check"></i>
          <div className="display-4">
            Done!
          </div>
        </div>
      )}
    </div>
  )
}