import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MapPage} from "./page/MapPage";
import {Login} from "./page/Login";
import { Layout } from "./components/Layout";
import { Profile } from "./page/Profile/Profile";
import { LikeBorsch } from "./page/LikeBorsch/LikeBorsch";
import { List } from "./page/List";
import { AddPage } from "./page/AddPage/AddPage";
import { ListPage } from "./page/ListPage/ListPage";
import {BorschPage} from "./page/BorschPage";
// import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import {PersonalInfo} from "./page/PersonalInfo";
import { EvaluationsPage } from "./page/EvaluationsPage";
import { SelectPlacePage } from "./page/SelectPlacePage";
import { SelectPlacePageFinish } from "./page/SelectPlacePageFinish";
import {UserPasswordPage} from "./page/UserPasswordPage";
import {PasswordChangePage} from "./page/PasswordChangePage";
import {HelpPage} from "./page/HelpPage/HelpPage";
import {AppGuide} from "./page/AppGuide/AppGuide";
import {FAQ} from "./page/FAQ";
import {AddedBorschesPage} from "./page/AddedBorschesPage";
import {Register} from "./page/Register";


export default function App() {  
  return (
    <BrowserRouter  basename="/">
      <Layout>              
          <Routes>
            <Route path="/" element={<MapPage/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/borsch/:borschId" element={<BorschPage/>}/>
            <Route path="/list" element={<ListPage/>}/>

            <Route path="/favorite" element={<LikeBorsch/>}/>
            <Route path="/reviews" element={<List/>}/>
            <Route path="/add-borsch" element={<AddPage/>}/>
            <Route path="/add-borsch/select-place" element={<SelectPlacePage/>}/>
            <Route path="/add-borsch/select-place/:borschId" element={<SelectPlacePageFinish/>}/>
            <Route path="/borsch/:borschId/evaluations" element={<EvaluationsPage/>}/>

              <Route path="/profile" element={<Profile/>}/>
              <Route path="/profile/personal-information" element={<PersonalInfo/>}/>
              <Route path="/profile/added-borsches" element={<AddedBorschesPage/>}/>
              {/*<Route path="/profile/password" element={<UserPasswordPage/>}/>*/}
              <Route path="/profile/change-password" element={<PasswordChangePage/>}/>
              <Route path="/help" element={<HelpPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/app-guide" element={<AppGuide />} />

            {/* <Route path="/favorite" element={<PrivateRoute><LikeBorsch/></PrivateRoute>}/>
            <Route path="/reviews" element={<PrivateRoute><List/></PrivateRoute>}/>
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
            <Route path="profile/personal-information" element={<PrivateRoute><PersonalInfo/></PrivateRoute>}/>
            <Route path="/add-borsch" element={<PrivateRoute><AddPage/></PrivateRoute>}/>
            <Route path="/add-borsch/select-place" element={<PrivateRoute><SelectPlacePage/></PrivateRoute>}/>
            <Route path="/add-borsch/select-place/:borschId" element={<PrivateRoute><SelectPlacePageFinish/></PrivateRoute>}/>
            <Route path="/borsch/:borschId/evaluations" element={<PrivateRoute><EvaluationsPage/></PrivateRoute>}/> */}
          </Routes>
      </Layout>
    </BrowserRouter>        
  );
}


