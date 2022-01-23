import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const EditorApp = lazy(() => import('./editor/App'));
const GeneratorApp = lazy(() => import('./generator/App'));
const ProjectsIndex = lazy(() => import('./projects/Index'));
const CommunitySpace = lazy(() => import('./community/App'));
const CommunityIndex = lazy(() => import('./community/Index'));
const ManagementPanel = lazy(() => import('./management/ManagementPanel'));
const NFTScanner = lazy(() => import('./nft_scanner/App'));
const Statistics = lazy(() => import('./statistics/App'));
const Marketplace = lazy(() => import('./marketplace/Marketplace'));
const MarketplaceIndex = lazy(() => import('./marketplace/Index'));
const LandingPage = lazy(() => import('./marketplace/LandingPage'));
const Playground = lazy(() => import('./playground/App'));
const Complete = lazy(() => import('./marketplace/components/Complete'));


function AppRoutes() {
  return (
    <Suspense fallback={<Spinner/>}>
      <Switch>
        <Route
          exact
          path="/scanner"
          component={(props) => (
            <NFTScanner {...props} />
          )}
        />
        <Route
          exact
          path="/c"
          component={(props) => (
            <CommunityIndex {...props} />
          )}
        />
        <Route
          exact
          path="/c/:communityId"
          component={(props) => (
            <CommunitySpace {...{...props, chain: 'eth'}} />
          )}
        />
        <Route
          exact
          path="/c/m/:communityId"
          component={(props) => (
            <CommunitySpace {...{...props, chain: 'polygon'}} />
          )}
        />
        <Route
          path="/projects/:projectId/generate"
          component={(props) => (
            <GeneratorApp {...props} />
          )}
        />
        <Route
          path="/projects/:projectId/management"
          component={(props) => (
            <ManagementPanel {...props} />
          )}
        />
        <Route
          exact
          path="/projects/:projectId/"
          component={(props) => (
            <EditorApp {...props} />
          )}
        />
        <Route
          exact
          path="/m/:marketplaceSlug/"
          component={(props) => (
            <Marketplace {...props} />
          )}
        />
        <Route
          exact
          path="/m/:marketplaceSlug/:nftId"
          component={(props) => (
            <Complete {...props} />
          )}
        />
        <Route
          exact
          path="/marketplace"
          component={() => (
            <MarketplaceIndex />
          )}
        />
        <Route
          exact
          path="/faq"
          component={() => (
            <LandingPage />
          )}
        />
        <Route
          exact
          path="/playground"
          component={() => (
            <Playground />
          )}
        />
        <Route
          exact
          path="/stats"
          component={() => (
            <Statistics />
          )}
        />
        <Route
          exact
          path="/"
          component={() => (
            <ProjectsIndex />
          )}
        />

        <Redirect to="/" />
      </Switch>
    </Suspense>
  );
}

export default AppRoutes;
