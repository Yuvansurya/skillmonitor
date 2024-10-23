const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const User = require('./models/User');
// console.log("here")
const app = express();

// // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/task', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Fetch Codeforces User Rating
const getCodeforcesUserRating = async (handle) => {
  try {
    console.log(`Fetching Codeforces rating for: ${handle}`);
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (response.data.status === 'OK') {
      const userInfo = response.data.result[0];
      return {
        rating: userInfo.rating || 'Unrated',
        rank: userInfo.rank || 'N/A',
        maxRating: userInfo.maxRating || 'N/A',
      };
    }
  } catch (error) {
    console.error(`Failed to fetch rating for ${handle}:`, error.message);
    return { rating: 'N/A', rank: 'N/A', maxRating: 'N/A' };
  }
};

// Fetch LeetCode User Rating
const getLeetCodeUserRating = async (handle) => {
  try {
    console.log(`Fetching LeetCode rating for: ${handle}`);
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${handle}/contest`);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json(); // Parse JSON response
    console.log("LeetCode data fetched:", data);

    return {
      lc_contestattended: data.contestAttend,
      lc_rating: data.contestRating,
      lc_rank: data.contestGlobalRanking,
      lc_toppercentage: data.contestTopPercentage
    };
  } catch (error) {
    console.error('Error fetching LeetCode contest information:', error);
    return undefined; // Return undefined on error
  }
};



// Function to get CodeChef rating
getCodechefrating = async (handle) => {
  try {
    console.log(`Fetching CodeChef rating for: ${handle}`);
    const response = await axios.get(`https://codechef-api.vercel.app/handle/${handle}`);
    const data = response.data;  // Access the response data directly
    console.log(data.currentRating);
    //console.log('22222');
    return {
      rating: data.currentRating,
      max_rating: data.highestRating,
      stars: data.stars
    };
  } catch (error) {
    console.error('Error fetching CodeChef rating information:', error);
    return { rating: 'N/A', max_rating: 'N/A', stars: 'N/A' };  // Return default values on error
  }
};

// Express route to handle post request
// Express route to handle post request
app.post('/cc', async (req, res) => {
  try {
    const users = await User.find({}, 'rollno codechef');

    for (const i of users) {
      if (!i.codechef) {  // Check if codechef handle exists
        console.log(`Codechef handle is missing for rollno: ${i.rollno}`);
        continue;  // Skip this user if handle is undefined
      }

      const username = i.codechef.split('/').pop();
      const ratingInfo = await getCodechefrating(username);
      await User.updateOne(
        { rollno: i.rollno },
        {
          $set: {
            cc_rating: ratingInfo.rating,
            cc_star: ratingInfo.stars,  // 'stars' not 'star'
            cc_maxrating: ratingInfo.max_rating
          }
        }
      );
    }

    res.send('Codechef ratings updated');
  } catch (error) {
    console.log(error);
    res.send('Error while updating ratings');
  }
});



// Insert User Information
app.post('/insert_info', async (req, res) => {
  const { name, rollNo, department, year, codeforces, leetcode, password, codechef } = req.body;
  console.log('Received data:', req.body); // Log the input data

  try {
    // Check if user already exists
    if (await User.findOne({ rollno: rollNo })) {
      return res.status(400).send('User already exists');
    }

    const codeforcesUsername = codeforces.split('/').pop();
    const leetcodeUsername = leetcode.split('/').pop();
    console.log(`Codeforces Username: ${codeforcesUsername}, LeetCode Username: ${leetcodeUsername}`);

    // Fetch ratings from external sources
    const ratingInfo = await getCodeforcesUserRating(codeforcesUsername);
    const lcInfo = await getLeetCodeUserRating(leetcodeUsername);

    if (!lcInfo) {
      return res.status(500).send('Failed to fetch LeetCode user rating');
    }

    // Create a new user
    const newUser = new User({
      name,
      rollno: rollNo,
      dept: department,
      year,
      codeforces,
      leetcode,
      codechef,
      password,
      cf_rating: ratingInfo.rating,
      cf_rank: ratingInfo.rank,
      cf_max_rating: ratingInfo.maxRating,
      lc_constestattended: lcInfo.lc_contestattended,
      lc_rank: lcInfo.lc_rank,
      lc_rating: lcInfo.lc_rating,
      lc_toppercentage: lcInfo.lc_toppercentage
    });

    await newUser.save();
    console.log('New user created:', newUser);
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('User validation failed: ' + error.message);
  }
});

// Update Codeforces Information
app.post('/cf_info', async (req, res) => {
  try {
    const users = await User.find({}, 'rollno codeforces');
    console.log('Updating Codeforces info for users:', users);

    for (const user of users) {
      const username = user.codeforces.split('/').pop();
      const ratingInfo = await getCodeforcesUserRating(username);
      await User.updateOne(
        { rollno: user.rollno },
        { $set: { cf_rating: ratingInfo.rating, cf_rank: ratingInfo.rank, cf_max_rating: ratingInfo.maxRating } }
      );
    }

    res.status(200).send('Codeforces ratings updated');
  } catch (error) {
    console.error('Error updating Codeforces info:', error);
    res.status(500).send('Error updating Codeforces info');
  }
});

// Fetch Codeforces Information
app.post('/get_cf_info', async (req, res) => {
  try {
    const users = await User.find({}, 'name rollno cf_rating cf_rank cf_max_rating');
    console.log('Fetched Codeforces info:', users);
    res.json(users);
  } catch (err) {
    console.error('Error retrieving Codeforces info:', err);
    res.status(500).send('Error retrieving Codeforces info');
  }
});

// Fetch LeetCode Information
app.post('/lc_info', async (req, res) => {
  const { user } = req.body;
  console.log(`Fetching LeetCode info for user: ${user}`);

  const lcInfo = await getLeetCodeUserRating(user);
  if (!lcInfo) {
    return res.status(500).send('Failed to fetch LeetCode user rating');
  }

  //console.log('Fetched LeetCode info:', lcInfo);
  res.json(lcInfo);
});

app.post('/get_lc_info', async (req, res) => {
  try {
    const users = await User.find({}, 'rollno leetcode');
    //console.log('Updating Leetcode info for users:', users);

    for (const user of users) {
      const username = user.leetcode.split('/').pop();
      const ratingInfo = await getLeetCodeUserRating(username);
      await User.updateOne(
        { rollno: user.rollno },
        {
          $set: {
            lc_contestattended: ratingInfo.lc_contestAttend,
            lc_rating: ratingInfo.lc_rating,
            lc_rank: ratingInfo.lc_rank,
            lc_toppercentage: ratingInfo.lc_toppercentage
          }
        }
      );
    }

    res.status(200).send('Leetcode ratings updated');
  } catch (error) {
    console.error('Error updating Codeforces info:', error);
    res.status(500).send('Error updating Codeforces info');
  }
});

app.post('/fetch_lc_info', async (req, res) => {
  try {
    const users = await User.find({}, 'name rollno lc_rating lc_toppercentage lc_rank lc_constestattended');
    //console.log('Fetched Codeforces info:', users);
    res.json(users);
  } catch (err) {
    console.error('Error retrieving Codeforces info:', err);
    res.status(500).send('Error retrieving Codeforces info');
  }
});
app.post('/fetch_cc_info', async (req, res) => {
  try {
    const users = await User.find({}, 'name rollno cc_rating cc_maxrating cc_star');
    //console.log('Fetched Codeforces info:', users);
    res.json(users);
  } catch (err) {
    console.error('Error retrieving Codeforces info:', err);
    res.status(500).send('Error retrieving Codeforces info');
  }
});




// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  // const i = await getCodechefrating('medavidebeneze')
  // console.log(i.rating)

  console.log(`Server running on port ${PORT}`)
});
