import React from 'react';
import { useState } from 'react';
import AuthModal from '../auth/AuthModal';

export default function SignUpToAddProjectCard({project, createNewProject}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div onClick={() => setShowAuthModal(true)} className="project-grid pointer project-card h-100 card bg-dark pointer border-white-dashed">
      <AuthModal show={showAuthModal} />
      <div className="card-body text-center d-flex" style={{alignItems: 'center', justifyContent: 'center'}}>
        <div>
          <h3>Sign up to create your own NFT collection</h3>
          <h1 className="mt-4"><i className="mdi mdi-login"></i></h1>
        </div>
      </div>
    </div>
  );
}