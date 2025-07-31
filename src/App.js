
import { BrowserRouter, Routes, Route} from "react-router-dom";
import {MapPage} from "./page/MapPage";
import {Login} from "./page/Login";
import { Layout } from "./components/Layout";
import { Profile } from "./page/Profile/Profile";
import { LikeBorsch } from "./page/LikeBorsch/LikeBorsch";
import { List } from "./page/List";
import { AddPage } from "./page/AddPage/AddPage";
import { ListPage } from "./page/ListPage/ListPage";
import {BorschPage} from "./page/BorschPage";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";



export default function App() {  
  return (
    <BrowserRouter  basename="/">
      <Layout>              
          <Routes>
            <Route path="/" element={<MapPage/>}/>
            <Route path="/login" element={<Login/>}/>            
            <Route path="/favorite" element={<LikeBorsch/>}/>  
            <Route path="/reviews" element={<List/>}/> 
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/add-borsch" element={<PrivateRoute><AddPage/></PrivateRoute>}/> 
            <Route path="/list" element={<ListPage/>}/> 
            <Route path="/borsch/:borschId" element={<BorschPage/>}/>                
          </Routes>
      </Layout>
      
    </BrowserRouter>        
  );
}


