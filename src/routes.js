/* eslint-disable no-unused-vars */
const { addReviewHandler, 
  getReviewsByDaerahIdHandler, 
  deleteReviewByIdHandler, 
  getAllMotifBatikHandler, 
  getAllDaerahHandler, 
  getMotifBatikByIdHandler, 
  getDaerahByIdHandler,
  getAllAlatHandler } = require("./handler");

const routes = [
    {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return `
      <h1>CULTIK - API</h1>
      <p>Cara penggunaan endpoints:</p>
      <ul>
        <li><h2>Method :</h2>POST <h2>URL :</h2>/reviews <br><h2>Deskripsi :</h2>
        - Adds a new review</li>
        <li><h2>Method :</h2>GET <h2>URL :</h2>/reviews/daerah/{daerahId} <br><h2>Deskripsi :</h2>
        - Retrieves reviews by daerah ID</li>
        <li><h2>Method :</h2>DELETE <h2>URL :</h2>/reviews/{id} <br><h2>Deskripsi :</h2>
        - Deletes a review by ID</li>
        <li><h2>Method :</h2>GET <h2>URL :</h2>/dataMotifBatik <br><h2>Deskripsi :</h2>
        - Retrieves all batik motifs</li>
        <li><h2>Method :</h2>GET <h2>URL :</h2>/dataMotifBatik/{id} <br><h2>Deskripsi :</h2>
        - Retrieves a batik motif by ID</li>
        <li><h2>Method :</h2>GET <h2>URL :</h2>/dataPenghasil <br><h2>Deskripsi :</h2>
        - Retrieves all producing regions</li>
        <li><h2>Method :</h2>GET <h2>URL :</h2>/dataPenghasil/{id} <br><h2>Deskripsi :</h2>
        - Retrieves a producing region by ID</li>
      </ul>
    `;
    }
    },
    {
      method: 'GET',
      path: '/favicon.ico',
      handler: (request, h) => {
        return '';
      }
    },
    {
      method: 'POST',
      path: '/reviews',
      handler: addReviewHandler,
    },
    {
      method: 'GET',
      path: '/reviews/daerah/{daerahId}',
      handler: getReviewsByDaerahIdHandler,
    },
    {
        method: 'DELETE',
        path: '/reviews/{id}',
        handler: deleteReviewByIdHandler,
      },
    {
      method: 'GET',
      path: '/dataMotifBatik',
      handler: getAllMotifBatikHandler,
    },
    {
      method: 'GET',
      path: '/dataMotifBatik/{id}',
      handler: getMotifBatikByIdHandler,
    },
    {
      method: 'GET',
      path: '/dataPenghasil',
      handler: getAllDaerahHandler,
    },
    {
      method: 'GET',
      path: '/dataPenghasil/{id}',
      handler: getDaerahByIdHandler,
    },
    {
      method: 'GET',
      path: '/alatBatik',
      handler: getAllAlatHandler,
    }
   ];
    
   module.exports = routes;