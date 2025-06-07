import axios from 'axios';
import cheerio from 'cheerio';
import Scholarship from '../db/Scholarships.js';


// scholarships landing page
export const getIndex = (req, res) => {
    res.send('Tasks available:' + 
    '\n/ - gets all scholarships in database' +
    '\n/scrape - (POSTMAN) webscrapes data and sends to database' + 
    '\n/[searchTerm] - search for items in database' + 
    '\n/clear - clears all items in database');
}
// db get all route
export const getAll = (req, res) => {
    //find all scholarships
    Scholarship.find({})
        .then(function(savedItems) {
        // if all items are successfully found
            res.json(savedItems);
        })
        .catch(function(err) {
            // if something wrong happens
            res.json(err);
    });
}
//db webscape to collect data
export const scrapeData = async (req, res) => {
  try {
    // Step 1: Delete all existing scholarship records
    await Scholarship.deleteMany({});
    console.log("Old scholarship data cleared.");

    // Step 2: Scrape new data
    const foundItems = await scrape();
    console.log("Scraped data:", foundItems);

    // Step 3: Insert new data into the database
    const savedItems = await Scholarship.insertMany(foundItems);
    console.log("New data saved successfully.");

    // Step 4: Send the response
    res.json(savedItems);
  } catch (err) {
    console.error("Error in scraping and saving:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// db search for items
export const getItem = (req, res) => {
    Scholarship.find({"title": { '$regex': req.params.searchTerm, 
    '$options': 'i' }})
        .then(function(foundItems) {
            res.json(foundItems);
        })
        .catch(function(err) {
            res.json(err);
        });
}
// db clear database
export const clear = (req, res) => {
    Scholarship.deleteMany({})
        .then(function(res) {
            res.json(res);
            res.send('Scholarship database cleared.');
        })
        .catch(function(err) {
            res.json(err);
        })
}
// helper function to scrape data 

export var scrape = function () {
  const list = [];

  return axios.get('https://collegesofdistinction.com/advice/the-mega-list-of-scholarships-you-should-apply-for-class-of-2019-2020/')
    .then(function (response) {
      const $ = cheerio.load(response.data);

      $('#content .content h3').each(function (i, elem) {
        const scholarship = {};
        scholarship.title = $(elem).text().trim();

        const ulElem = $(elem).next('ul');
        const liElems = ulElem.find('li');

        liElems.each((i, li) => {
          const text = $(li).text().trim();

          if (text.startsWith("Award Amount:") || text.startsWith("Amount:")) {
            scholarship.award = text.replace(/^(Award Amount:|Amount:)/i, '').trim();
          } else if (text.startsWith("Deadline:")) {
            scholarship.deadline = text.replace(/^Deadline:/i, '').trim();
          } else if (text.startsWith("Eligibility:")) {
            scholarship.eligibility = text.replace(/^Eligibility:/i, '').trim();
          } else if (text.startsWith("Overview:") || text.startsWith("Description:")) {
            scholarship.description = text.replace(/^(Overview:|Description:)/i, '').trim();
          }
        });

        // Extract link from <a> inside <h3>
        const linkElem = $(elem).find('a');
        scholarship.website = linkElem.attr('href') || "N/A";

        // Provide defaults if not found
        scholarship.award = scholarship.award || "N/A";
        scholarship.deadline = scholarship.deadline || "TBD";
        scholarship.eligibility = scholarship.eligibility || "N/A";
        scholarship.description = scholarship.description || "No description.";

        list.push(scholarship);
      });
      return list;
    });
};


