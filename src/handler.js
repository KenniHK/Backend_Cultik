/* eslint-disable no-unused-vars */
const { nanoid } = require("nanoid");
const reviews = require("./reviews");
const { MongoClient, ServerApiVersion } = require('mongodb');
const data_motif_batik = require("./dataMotif")
const { ObjectId } = require('mongodb');
const data_daerah_penghasil = require('./dataDaerah')
require('dotenv').config();

//konfihurasi mongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });


let reviewsCollection;
let dataDaerahPenghasilCollection;
let dataMotifBatikCollection;


    const connectToDatabase = async () => {
        try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('MongoDB connected successfully.');


          const database = client.db('Cultik_DataBase');
          reviewsCollection = database.collection('reviews');
          dataDaerahPenghasilCollection = database.collection('data_daerah_penghasil');
          dataMotifBatikCollection = database.collection('data_motif_batik');

          console.log('Collections initialized.');
        } catch (err) {
          console.error('Failed to connect to MongoDB:', err.message);
          setTimeout(connectToDatabase, 5000); 
        }
      };
      
connectToDatabase();

// Masukin Review
const addReviewHandler = async (request, h) => {
    const { name, review, daerahId } = request.payload;
    const id = nanoid(16);
    const date = new Date().toISOString();
    const newReview = { id, name, review, date, daerahId };

    try {
        console.log('Adding review...');
        await reviewsCollection.insertOne(newReview);
        console.log('Review added successfully:', newReview);
        const response = h.response({
            status: 'success',
            message: 'Review berhasil ditambahkan',
            data: { reviewId: id },
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Failed to add review:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Review gagal ditambahkan',
        });
        response.code(500);
        return response;
    }
};

// Dapatkan review berdasarkan daerahId
const getReviewsByDaerahIdHandler = async (request, h) => {
    const { daerahId } = request.params;
    try {
        console.log('Fetching reviews for daerahId:', daerahId);
        const daerahReviews = await reviewsCollection.find({ daerahId }).toArray();
        if (daerahReviews.length > 0) {
            return {
                status: 'success',
                data: { reviews: daerahReviews },
            };
        } else {
            return {
                status: 'fail',
                message: 'Review tidak ditemukan',
            };
        }
    } catch (error) {
        console.error('Failed to fetch reviews:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data',
        };
    }
};

// Hapus review
const deleteReviewByIdHandler = async (request, h) => {
    const { id } = request.params;
    try {
        console.log('Deleting review with id:', id);
        const result = await reviewsCollection.deleteOne({ id });

        if (result.deletedCount === 1) {
            const response = h.response({
                status: 'success',
                message: 'Review berhasil dihapus',
            });
            response.code(200);
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Review gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    } catch (error) {
        console.error('Failed to delete review:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Review gagal dihapus',
        });
        response.code(500);
        return response;
    }
};

//data_motif_batik 
const getAllMotifBatikHandler = async (request, h) => {
    try {
        console.log('Fetching all motif batik...');
        const data_motif_batik = await dataMotifBatikCollection.find().toArray();
        return {
            status: 'success',
            data: { data_motif_batik },
        };
    } catch (error) {
        console.error('Failed to fetch data_motif_batik:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data',
        };
    }
};

// Dapatkan motif batik berdasarkan Id
const getMotifBatikByIdHandler = async (request, h) => {
    const { id } = request.params;
    try {
        console.log('Fetching motif batik with id:', id);
        const objectId = new ObjectId(id);
        const motifBatikId = await dataMotifBatikCollection.findOne({ _id: objectId });

        if (motifBatikId) {
            return {
                status: 'success',
                data: { motifBatikId },
            };
        } else {
            return {
                status: 'fail',
                message: 'Motif batik tidak ditemukan',
            };
        }
    } catch (error) {
        console.error('Failed to fetch motif batik:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data',
        };
    }
};
  


//data daerah Pengahasil Batik
const getAllDaerahHandler = async (request, h) => {
    try {
        console.log('Fetching all daerah penghasil...');
        const data_daerah_penghasil = await dataDaerahPenghasilCollection.find().toArray();
        return {
            status: 'success',
            data: { data_daerah_penghasil },
        };
    } catch (error) {
        console.error('Failed to fetch data_daerah_penghasil:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data daerah',
        };
    }
};
  
  // Dapatkan daerah berdasarkan Id
  const getDaerahByIdHandler = async (request, h) => {
    const { id } = request.params;
    try {
        console.log('Fetching daerah with id:', id);
        const objectId = new ObjectId(id);
        const dataDaerahId = await dataDaerahPenghasilCollection.findOne({ _id: objectId });

        if (dataDaerahId) {
            return {
                status: 'success',
                data: { dataDaerahId },
            };
        } else {
            return {
                status: 'fail',
                message: 'Daerah tidak ditemukan',
            };
        }
    } catch (error) {
        console.error('Failed to fetch daerah:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data',
        };
    }
};

  // Logging saat aplikasi dihentikan
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});


module.exports = {addReviewHandler, 
                getReviewsByDaerahIdHandler, 
                deleteReviewByIdHandler, 
                getAllMotifBatikHandler, 
                getAllDaerahHandler, 
                getMotifBatikByIdHandler,
                getDaerahByIdHandler};