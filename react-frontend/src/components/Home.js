
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate} from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { doSignOut } from "../firebase/FirebaseFunctions";

// import the home page css
import "./Home.css";

const Home = () => {
  const currentUser = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const storage = getStorage();
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate(); // useNavigate hook
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // for previewing image
  const [processedFile, setProcessedFile] = useState(null); // for uploading to Cloud Storage
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [removeBgProcessing, setRemoveBgProcessing] = useState(''); // for showing processing status

  useEffect(() => {
    const auth = getAuth();
    if (currentUser) {
      setUserName(currentUser.displayName);
    }
  }
  , [currentUser]);

  const handleSignOut = () => {
    doSignOut();
    navigate('/');
    alert("You have been signed out");
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/jpeg", "image/png", "image/jpg", "image/bmp", "image/webp"].includes(selectedFile.type)) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null); // reset preview url
      }  
      setFile(selectedFile);
      setProcessedFile(null); // reset processed file
      setUploadSuccess(false); // reset upload success
      setRemoveBgProcessing(''); // reset processing status
    } else {
      alert("Unsupported file type. Please select an image.");
      setFile(null);
    }
  };
  
  // remove background from image
  const handleConfirm = async () => {
    if (file) {
      setRemoveBgProcessing('Removing image background...'); // set processing status
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', file, file.name);
  
      try {
        const response = await fetch("http://127.0.0.1:5000/remove-bg", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const blobData = await response.blob();
        setProcessedFile(new File([blobData], file.name, { type: 'image/png' }));
        setPreviewUrl(URL.createObjectURL(blobData));
        setRemoveBgProcessing('Background removal completed'); // reset processing status
      } catch (error) {
        console.error("Error removing background:", error);
        setRemoveBgProcessing('Failed to remove background');
        alert("Error removing background.");
      }
    }
  };
  

  const checkDocumentExists = async (userId) => {
    const db = getFirestore();
    const docRef = doc(db, "closets", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  // upload file after user has confirmed the processed image
  const handleUpload = async () => {
    if (!currentUser) {
      alert("Please log in to upload files.");
      return;
    }
  
    if (!category) {
      alert("Please select a category for your clothing item.");
      return;
    }
  
    if (!processedFile) {
      alert("No processed file to upload.");
      return;
    }

    const exists = await checkDocumentExists(currentUser.uid);
    const storageRef = ref(storage, `clothes/${currentUser.uid}/${category}/${processedFile.name}`);

    try{
      const uploadTaskSnapshot = await uploadBytes(storageRef, processedFile);
      const url = await getDownloadURL(uploadTaskSnapshot.ref);
      
      // update or create document in Firestore
      const db = getFirestore();
      const closetRef = doc(db, "closets", currentUser.uid);
      const newClothingItem = {
        url,
        category,
        name: processedFile.name,
        timestamp: new Date()
      };
      
      // if document exists, update it; otherwise, create it
      await setDoc(closetRef, { items: exists ? arrayUnion(newClothingItem) : [newClothingItem] }, { merge: true });

      // set last uploaded file for display
      setLastUploadedFile({ category, name: processedFile.name });
      setUploadSuccess(true); // set upload success to true
      alert("File uploaded and info saved to Firestore successfully!");
      // Reset file input visually by clearing its value
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error("Error uploading file or saving file info to Firestore:", error);
      alert("Error uploading file or saving file info.");
    }
  };

  return (
    <section className="container">
        <header className="header"> 
        <div className="loginMenu">
        {currentUser ? (
          <>
            <select onChange={(e) => {
              if (e.target.value === 'myCloset') {
                navigate('/myCloset');
              } else if (e.target.value === 'signOut') {
                handleSignOut();
              }
            }} /*style={{background: "none", border: "none", cursor: "pointer"}}*/>
              <option value="">{`Welcome, ${currentUser.displayName || 'User'}`}</option>
              <option value="myCloset">Account</option>
              <option value="myCloset">My Closet</option>
              <option value="signOut">Sign Out</option>
            </select>
          </>
        ) : (
          <>
            <Link to="/register">Sign Up</Link>
            {" | "}
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
        </header>
        <div className="containerMiddle">
          <h1>Welcome to your  Closet</h1>
          <p>Please select a category and upload your clothes</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="T-shirts">T-shirts</option>
          <option value="Longsleeves">Longsleeves</option>
          <option value="Tank tops">Tank tops</option>
          <option value="Hoodies">Hoodies</option>
          <option value="Blouses">Blouses</option>
          <option value="Blazers & Vests">Blazers & Vests</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Jeans">Jeans</option>
          <option value="Pants">Pants</option>
          <option value="Agency pant">Agency pant</option>
          <option value="Shorts">Shorts</option>
          <option value="Jackets">Jackets</option>
          <option value="Coats">Coats</option>
          <option value="Overcoats">Overcoats</option>
          <option value="Skirts">Skirts</option>
          <option value="Suits">Suits</option>
          <option value="Dresses">Dresses</option>
          <option value="Shoes">Shoes</option>
          <option value="Boots">Boots</option>
          <option value="Leather shoes">Leather shoes</option>
          <option value="Sandals">Sandals</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Heels">Heels</option>
          <option value="Hats">Hats</option>
          <option value="Bags">Bags</option>
          <option value="Accessories">Accessories</option>
          </select>
          <p>Please upload your clothes</p>
          <input type="file" onChange={handleFileChange} id="fileInput"/>
          {file && <button onClick={handleConfirm}>Confirm Image</button>}
          <p>Supported formats: .jpg, .png, .jpeg, .bmp, .webp</p>
          {/* <div>
            {lastUploadedFile && (
              <p style={{ color: 'red', fontSize: '12px' }}>
                Last uploaded file: ({lastUploadedFile.category}), {lastUploadedFile.name}
              </p>
            )}
          </div> */}
          <div>
            {removeBgProcessing && <p style={{ color: 'red', fontSize: '12px'}}>{removeBgProcessing}</p>}
          </div>
          <div>
            {previewUrl && (
              <>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '600px' }}/>
                {processedFile && <button onClick={handleUpload}>Save to Closet</button>}
              </>
            )}
          </div>
          {uploadSuccess && <p style={{ color: 'red', fontSize: '12px' }}>Last uploaded file: ({lastUploadedFile?.category}), {lastUploadedFile?.name} has been saved to your closet!</p>}
        </div>
        <footer className="footer">Footer Content Will Go Here</footer>
    </section>
  );
};

export default Home;
