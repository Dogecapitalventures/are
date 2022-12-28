import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RouteList } from "../interfaces/route.interface";
import Layout from "../layouts";
import {routeList} from './routes-lists'

export default function () {
  window.location.pathname === "/" && window.location.replace("/dashboard");
  return (
    <BrowserRouter>
        <Layout>
        <Suspense fallback={<>Loading...</>}>
          <Routes>
            {routeList.map((route: RouteList, index) => {              
              return (
                <Route
                  path={route.path}
                  key={index}
                  element={
                      <route.component />
                  }
                />
              );
            })}
          </Routes>
          </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
