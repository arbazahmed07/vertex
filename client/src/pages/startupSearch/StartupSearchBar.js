// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Posts from "./Posts";
// import { Box, Grid } from "@mui/material";
// import React, { useState, useEffect, Fragment } from "react";
// import axios from "axios";

// function StartupSearchBar() {
//   const [searchBy, setSearchBy] = React.useState("");
//   const [posts, setPosts] = React.useState([]);
//   const [tempProfiles, setTempProfiles] = React.useState([]);

//   const url = process.env.REACT_APP_API_URL;
//   // console.log("ues",url)
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = () => {
//     axios
//       .get(`${url}/startups/fetchAll`)
//       .then((response) => {
//         const allData = response.data.startup;
//         console.log(allData);
//         setPosts(allData);
//         setTempProfiles(allData);
//       })
//       .catch((error) => console.error(`Error: ${error}`));
//   };

//   const onSumbit = () => {
//     const newPosts = posts.filter(
//       (post) =>
//         post.name.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
//         post.industries.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
//         post.locations.toLowerCase().indexOf(searchBy.toLowerCase()) > -1
//     );
//     setTempProfiles(newPosts);
//   };

//   return (
//     <Box sx={{ height: "100%", marginBottom: "10%", marginTop: "1%" }}>
//       <Box sx={{ height: "10%", display: "flex", justifyContent: "center" }}>
//         <Grid
//           container
//           spacing={1}
//           sx={{ width: "20%", justifyContent: "center" }}
//         >
//           <Grid item md={9} sx={{ height: "10%", width: "90%" }}>
//             {/* <div className="App"> */}
//             <TextField
//               value={searchBy}
//               name="searchBy"
//               id={searchBy}
//               onChange={(e) => setSearchBy(e?.target?.value)}
//               onKeyPress={(event) => {
//                 if (event.key === "Enter") {
//                   onSumbit();
//                 }
//               }}
//               label="Search By Name/Location/Industry"
//             />
//           </Grid>
//           <Grid item md={3} sx={{ marginTop: "2.5%", width: "10%" }}>
//             <Button variant="outlined" size="large" onClick={onSumbit}>
//               Go
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//       <Box sx={{ height: "90%" }}>
//         <Posts posts={tempProfiles} />        
//       </Box>
//     </Box>
//   );
// }

// export default StartupSearchBar;



// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Posts from "./Posts";
// import { Box, Grid } from "@mui/material";
// import React, { useState, useEffect, Fragment } from "react";
// import axios from "axios";

// function StartupSearchBar() {
//   const [searchBy, setSearchBy] = React.useState("");
//   const [posts, setPosts] = React.useState([]);
//   const [tempProfiles, setTempProfiles] = React.useState([]);

//   const url = process.env.REACT_APP_API_URL;
  
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = () => {
//     axios
//       .get(`${url}/startups/fetchAll`)
//       .then((response) => {
//         const allData = response.data.startup;
//         console.log(allData);
//         setPosts(allData);
//         setTempProfiles(allData);
//       })
//       .catch((error) => console.error(`Error: ${error}`));
//   };

//   const onSumbit = () => {
//     const newPosts = posts.filter(
//       (post) =>
//         post.name.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
//         post.industries.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
//         post.locations.toLowerCase().indexOf(searchBy.toLowerCase()) > -1
//     );
//     setTempProfiles(newPosts);
//   };

//   return (
//     <Box sx={{ height: "100%", marginBottom: "10%", marginTop: "1%" }}>
//       <Box sx={{ height: "10%", display: "flex", justifyContent: "center" }}>
//         <Grid
//           container
//           spacing={1}
//           sx={{ width: "20%", justifyContent: "center" }}
//         >
//           <Grid item md={9} sx={{ height: "10%", width: "90%" }}>
//             <TextField
//               value={searchBy}
//               name="searchBy"
//               id={searchBy}
//               onChange={(e) => setSearchBy(e?.target?.value)}
//               onKeyPress={(event) => {
//                 if (event.key === "Enter") {
//                   onSumbit();
//                 }
//               }}
//               label="Search By Name/Location/Industry"
//             />
//           </Grid>
//           <Grid item md={3} sx={{ marginTop: "2.5%", width: "10%" }}>
//             <Button variant="outlined" size="large" onClick={onSumbit}>
//               Go
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//       <Box sx={{ height: "90%" }}>
//         <Posts posts={tempProfiles} />        
//       </Box>
//     </Box>
//   );
// }

// export default StartupSearchBar;



import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Posts from "./Posts";
import { Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

function StartupSearchBar() {
  const [searchBy, setSearchBy] = useState("");
  const [posts, setPosts] = useState([]);
  const [tempProfiles, setTempProfiles] = useState([]);

  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await axios.get(`${url}/startups/fetchAll`);
      console.log("first",res)
      const allData = res.data.startup;
      setPosts(allData);
      setTempProfiles(allData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const onSubmit = () => {
    const query = searchBy.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const name = post?.name?.toLowerCase() || "";
      const industries = Array.isArray(post.industries)
        ? post.industries.join(", ").toLowerCase()
        : (post.industries || "").toLowerCase();
      const locations = Array.isArray(post.locations)
        ? post.locations.join(", ").toLowerCase()
        : (post.locations || "").toLowerCase();

      return (
        name.includes(query) ||
        industries.includes(query) ||
        locations.includes(query)
      );
    });
    setTempProfiles(filtered);
  };

  return (
    <Box sx={{ height: "100%", marginBottom: "10%", marginTop: "1%" }}>
      <Box sx={{ height: "10%", display: "flex", justifyContent: "center" }}>
        <Grid
          container
          spacing={1}
          sx={{ width: "20%", justifyContent: "center" }}
        >
          <Grid item md={9}>
            <TextField
              fullWidth
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              label="Search By Name / Location / Industry"
            />
          </Grid>
          <Grid item md={3}>
            <Button variant="outlined" size="large" onClick={onSubmit}>
              Go
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: "90%" }}>
        <Posts posts={tempProfiles} />
      </Box>
    </Box>
  );
}

export default StartupSearchBar;
