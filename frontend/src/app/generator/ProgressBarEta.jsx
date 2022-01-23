import React, { useRef, useState } from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap'


const msToRemaining = (timeDiff) => {
  var secDiff = Math.floor(timeDiff / 1000); //in s
  var minDiff = Math.floor(timeDiff / 60 / 1000); //in minutes
  var hDiff = Math.floor(timeDiff / 3600 / 1000); //in hours
  if (hDiff > 0) {
    return `${hDiff} hour${hDiff === 1 ? '' : 's'}`;
  } else if (minDiff > 0) {
    return `${minDiff} minute${minDiff === 1 ? '' : 's'}`;
  } else {
    return `a few seconds`;
  }
}


export default function ProgressBarEta({progress, total}) {
  const [startedAt, _] = useState((new Date()).getTime());
  const millisSinceStarted = ((new Date()).getTime() + 100) - startedAt;
  const millisPerIteration = millisSinceStarted / progress;
  const iterationsRemaining = total - progress;
  const millisRemaining = iterationsRemaining * millisPerIteration;
  return (
    <div>
      <div className="h5 text-right mt-2">
        {progress} / {total} (est {msToRemaining(millisRemaining)} remaining)
      </div>
      <ProgressBar variant="success" className="my-4" now={progress / total * 100} />
    </div>
  )
}