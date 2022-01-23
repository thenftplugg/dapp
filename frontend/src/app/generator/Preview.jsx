import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Generator } from "./utils"
import ClipLoader from "react-spinners/ClipLoader";
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import EditorContext from '../editor/context';
import Creator from '../editor/components/Creator';
import SimplePills from '../shared/SimplePills';

const VIEW_COMPOSER = 'composer';
const VIEW_PREVIEW = 'preview';
export default function Preview({ project, group }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);
  const loader = useRef(null);
  const [currentView, setCurrentView] = useState(VIEW_COMPOSER);
  const { selected, composerAssetByLayerId } = useContext(EditorContext);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      generateImages();
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const generateImages = () => {
    setLoading(true);
    const numByGroupId = {};
    if (group) {
      numByGroupId[group.id] = 30;
    } else if (project.groups.length === 1) {
      numByGroupId[project.groups[0].id] = 30;
    } else {
      project.groups.forEach(g => {
        numByGroupId[g.id] = 30;
      })
    }

    const g = new Generator(project, numByGroupId, {});
    g.setCallbacks({
      drewOneImage: (dataUrl) => {
        setLoading(false);
        imagesRef.current = [...imagesRef.current, dataUrl];
        setImages(imagesRef.current)
      }
    });
    g.preview();
  }

  /*
  useEffect(() => {
    generateImages();
  }, []);
  */

  return (
    <div className="text-center mt-3">
      <div style={{overflow: "overlay", height: "100vh"}}>
        <div className="mb-3">
          <SimplePills pills={[[VIEW_COMPOSER, 'Composer'], [VIEW_PREVIEW, 'Preview']]} onChange={setCurrentView} selected={currentView} />
        </div>

        <div ref={loader} />

        {currentView === VIEW_COMPOSER && (
          <div>
            {project && <Creator project={project} selectedGroupId={selected.groupId} composerAssetByLayerId={composerAssetByLayerId} />}
          </div>
        )}
        {currentView === VIEW_PREVIEW && (
          <div>
            {images.map((image, idx) => {
              return <img key={idx} width="250" className="shadow-lg rounded-lg my-2" src={image} />
            })}

            {loading && (
              <div className="my-4">
                <ClipLoader color="#8f5fe8" loading={loading} size={50} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
