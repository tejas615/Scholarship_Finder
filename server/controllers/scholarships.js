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
        const scholarship = {
          title: $(elem).text().trim(),
          award: 'N/A',
          deadline: 'TBD',
          eligibility: 'N/A',
          description: 'No description.',
          website: 'N/A'
        };

        // Extract link if available
        const linkElem = $(elem).find('a');
        if (linkElem && linkElem.attr('href')) {
          scholarship.website = linkElem.attr('href');
        }

        const nextElem = $(elem).next();

        // Case 1: List format
        if (nextElem.is('ul')) {
          nextElem.find('li').each((i, li) => {
            const text = $(li).text().trim();
            extractField(text, scholarship);
          });
        }

        // Case 2: Paragraph format
        else if (nextElem.is('p')) {
          const text = nextElem.text().trim();
          extractField(text, scholarship);
        }

        list.push(scholarship);
      });

      return list;
    })
    .catch(error => {
      console.error("Scraping error:", error.message);
      return [];
    });
};

// ✅ Helper to extract fields from li or p
function extractField(text, scholarship) {
  const lines = text.split(/[\n;.]+/); // split on newline, semicolon, or period

  lines.forEach(line => {
    const trimmed = line.trim();

    if (/^(Award Amount:|Amount:)/i.test(trimmed)) {
      scholarship.award = trimmed.replace(/^(Award Amount:|Amount:)/i, '').trim();
    } else if (/^Deadline:/i.test(trimmed)) {
      scholarship.deadline = trimmed.replace(/^Deadline:/i, '').trim();
    } else if (/^Eligibility:/i.test(trimmed)) {
      scholarship.eligibility = trimmed.replace(/^Eligibility:/i, '').trim();
    } else if (/^(Overview:|Description:)/i.test(trimmed)) {
      scholarship.description = trimmed.replace(/^(Overview:|Description:)/i, '').trim();
    }
  });
}
