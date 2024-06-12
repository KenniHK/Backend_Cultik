/* eslint-disable no-unused-vars */
const { nanoid } = require("nanoid");
const reviews = require("./reviews");
const data_motif_batik = require("./dataMotif")
const data_daerah_penghasil = require('./dataDaerah')
require('dotenv').config();
const admin = require('firebase-admin');

// Konfigurasi Firebase
console.log('Firebase config:', process.env.FIREBASE_CONFIG);
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();

const reviewsCollection = db.collection('reviews');
const dataDaerahPenghasilCollection = db.collection('daerah_penghasil');
const dataMotifBatikCollection = db.collection('data_motif_batik');

// Masukin Review
const addReviewHandler = async (request, h) => {
    const { name, review, daerahId } = request.payload;
    const id = nanoid(16);
    const date = new Date().toISOString();
    const newReview = { id, name, review, date, daerahId };

    try {
        console.log('Adding review...');
        await reviewsCollection.doc(id).set(newReview);
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
        const daerahReviews = await reviewsCollection.where('daerahId', '==', daerahId).get();
        if (!daerahReviews.empty) {
            const reviewsArray = daerahReviews.docs.map(doc => doc.data());
            return {
                status: 'success',
                data: { reviews: reviewsArray },
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
        const reviewRef = reviewsCollection.doc(id);
        const review = await reviewRef.get();

        if (!review.exists) {
            const response = h.response({
                status: 'fail',
                message: 'Review gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        await reviewRef.delete();
        const response = h.response({
            status: 'success',
            message: 'Review berhasil dihapus',
        });
        response.code(200);
        return response;
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
        const data_motif_batik = await dataMotifBatikCollection.get();
        const motifBatikArray = data_motif_batik.docs.map(doc => doc.data());
        return {
            status: 'success',
            data: { data_motif_batik: motifBatikArray },
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
        const motifBatikId = await dataMotifBatikCollection.doc(id).get();

        if (motifBatikId.exists) {
            return {
                status: 'success',
                data: { motifBatikId: motifBatikId.data() },
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
        const daerah_penghasil = await dataDaerahPenghasilCollection.get();
        const daerahArray = daerah_penghasil.docs.map(doc => doc.data());
        return {
            status: 'success',
            data: { daerah_penghasil: daerahArray },
        };
    } catch (error) {
        console.error('Failed to fetch daerah_penghasil:', error.message);
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
        const dataDaerahId = await dataDaerahPenghasilCollection.doc(id).get();

        if (dataDaerahId.exists) {
            return {
                status: 'success',
                data: { dataDaerahId: dataDaerahId.data() },
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
    console.log('Closing Firestore connection...');
    await admin.app().delete();
    console.log('Firestore connection closed');
    process.exit(0);
});


module.exports = {addReviewHandler, 
                getReviewsByDaerahIdHandler, 
                deleteReviewByIdHandler, 
                getAllMotifBatikHandler, 
                getAllDaerahHandler, 
                getMotifBatikByIdHandler,
                getDaerahByIdHandler};