// import React, { useState, useEffect, useRef } from 'react';
// import './shared/CreatePostForm.css';

// const API_BASE_URL = 'http://localhost:5000';

// const CreatePostForm = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     subtitle: '',
//     description: '',
//     rating: 0,
//     media: [] as File[],
//   });

//   const [previews, setPreviews] = useState<string[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRatingChange = (rating: number) => {
//     setFormData({ ...formData, rating });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const newFiles = Array.from(e.target.files);
//     const currentFiles = formData.media;
//     const combinedFiles = [...currentFiles, ...newFiles];

//     const images = combinedFiles.filter((f) => f.type.startsWith('image/'));
//     const videos = combinedFiles.filter((f) => f.type.startsWith('video/'));

//     if (images.length > 3) {
//       alert('You can upload up to 3 images only.');
//       return;
//     }
//     if (videos.length > 1) {
//       alert('You can upload only 1 video.');
//       return;
//     }
//     if (combinedFiles.length > 4) {
//       alert('You can upload max 4 files: up to 3 images and 1 video.');
//       return;
//     }

//     setFormData({ ...formData, media: combinedFiles });

//     // Reset file input to allow same file re-selection
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     setFormData((prev) => {
//       const newMedia = [...prev.media];
//       newMedia.splice(index, 1);
//       return { ...prev, media: newMedia };
//     });
//   };

//   useEffect(() => {
//     if (formData.media.length === 0) {
//       setPreviews([]);
//       return;
//     }

//     const newPreviews = formData.media.map((file) => URL.createObjectURL(file));
//     setPreviews(newPreviews);

//     return () => {
//       newPreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [formData.media]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const userData = localStorage.getItem('user');
//     if (!userData) {
//       alert('User not logged in.');
//       return;
//     }
//     const { _id } = JSON.parse(userData);

//     if (
//       !formData.title ||
//       !formData.subtitle ||
//       !formData.description ||
//       formData.rating === 0
//     ) {
//       alert('Please fill in all required fields and select a rating.');
//       return;
//     }
//     if (formData.media.length === 0) {
//       alert('Please upload at least one media file.');
//       return;
//     }

//     setSubmitting(true);

//     const data = new FormData();
//     data.append('title', formData.title);
//     data.append('subtitle', formData.subtitle);
//     data.append('description', formData.description);
//     data.append('rating', formData.rating.toString());
//     data.append('createdBy', _id);
//     formData.media.forEach((file) => data.append('media', file));

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
//         method: 'POST',
//         body: data,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//        //  res.status(500).json({ error: err.message, stack: err.stack });
//         throw new Error(error.message || 'Failed to create post');
//       }

//       const result = await response.json();
//       console.log('Post created:', result);
//       alert('Post created successfully!');
//       setFormData({ title: '', subtitle: '', description: '', rating: 0, media: [] });
//       setPreviews([]);
//     } catch (error: any) {
//       console.error('Error creating post:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form className="form-container" onSubmit={handleSubmit}>
//       <h2>Create a Post</h2>

//       <label>Title:</label>
//       <input
//         type="text"
//         name="title"
//         value={formData.title}
//         onChange={handleChange}
//         required
//       />

//       <label>Subtitle:</label>
//       <input
//         type="text"
//         name="subtitle"
//         value={formData.subtitle}
//         onChange={handleChange}
//         required
//       />

//       <label>Description:</label>
//       <textarea
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         required
//       />

//       <label>Rating:</label>
//       <div className="star-rating" style={{ cursor: 'pointer' }}>
//         {[1, 2, 3, 4, 5].map((num) => (
//           <span
//             key={num}
//             className={`star ${formData.rating >= num ? 'selected' : ''}`}
//             onClick={() => handleRatingChange(num)}
//             role="button"
//             aria-label={`${num} star`}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       <label>Upload Media (up to 3 images and 1 video):</label>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*,video/*"
//         multiple
//         onChange={handleFileChange}
//       />

//       {previews.length > 0 && (
//         <div
//           className="preview-container"
//           style={{
//             marginTop: '1rem',
//             display: 'flex',
//             gap: '10px',
//             flexWrap: 'wrap',
//             alignItems: 'center',
//           }}
//         >
//           {formData.media.map((file, i) => (
//             <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
//               {file.type.startsWith('video/') ? (
//                 <video
//                   src={previews[i]}
//                   width={120}
//                   height={90}
//                   controls
//                   style={{ objectFit: 'cover', borderRadius: 6 }}
//                 />
//               ) : (
//                 <img
//                   src={previews[i]}
//                   alt={`preview-${i}`}
//                   width={120}
//                   height={90}
//                   style={{ objectFit: 'cover', borderRadius: 6 }}
//                 />
//               )}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveFile(i)}
//                 style={{
//                   position: 'absolute',
//                   top: 2,
//                   right: 2,
//                   background: 'rgba(0,0,0,0.6)',
//                   border: 'none',
//                   color: 'white',
//                   borderRadius: '50%',
//                   width: 22,
//                   height: 22,
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   lineHeight: '18px',
//                 }}
//                 aria-label="Remove file"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <button type="submit" style={{ marginTop: '1rem' }} disabled={submitting}>
//         {submitting ? 'Submitting...' : 'Submit Post'}
//       </button>
//     </form>
//   );
// };

// export default CreatePostForm;

import React, { useState, useEffect } from 'react';
import './shared/CreatePostForm.css';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = 'http://localhost:5000';


const CreatePostForm = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    rating: 0,
    media: [] as File[],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const currentFiles = formData.media;

    const combinedFiles = [...currentFiles, ...newFiles];

    const images = combinedFiles.filter((f) => f.type.startsWith('image/'));
    const videos = combinedFiles.filter((f) => f.type.startsWith('video/'));

    if (images.length > 3) {
      alert('You can upload up to 3 images only.');
      return;
    }
    if (videos.length > 1) {
      alert('You can upload only 1 video.');
      return;
    }
    if (combinedFiles.length > 4) {
      alert('You can upload max 4 files: up to 3 images and 1 video.');
      return;
    }

    setFormData({ ...formData, media: combinedFiles });
  };

  const handleRemoveFile = (index: number) => {
    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData({ ...formData, media: newMedia });
  };

  useEffect(() => {
    if (formData.media.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = formData.media.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('User not logged in.');
      return;
    }

    const { email } = JSON.parse(userData); // Send email to backend

    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      formData.rating === 0
    ) {
      alert('Please fill in all required fields and select a rating.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('description', formData.description);
    data.append('rating', formData.rating.toString());
    data.append('createdBy', email);
    formData.media.forEach((file) => data.append('media', file));
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      const result = await response.json();
      console.log('Post created:', result);
      alert('Post created successfully!');
      navigate('/Profile');
      setFormData({ title: '', subtitle: '', description: '', rating: 0, media: [] });
      setPreviews([]);
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Create a Post</h2>

      <label>Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label>Subtitle:</label>
      <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} required />

      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <label>Rating:</label>
      <div className="star-rating" style={{ cursor: 'pointer' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`star ${formData.rating >= num ? 'selected' : ''}`}
            onClick={() => handleRatingChange(num)}
            role="button"
            aria-label={`${num} star`}
          >
            ★
          </span>
        ))}
      </div>

      <label>Upload Media (up to 3 images and 1 video):</label>
      <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} />

      {previews.length > 0 && (
        <div className="preview-container" style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {formData.media.map((file, i) => (
            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
              {file.type.startsWith('video/') ? (
                <video src={previews[i]} width={120} height={90} controls style={{ objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <img src={previews[i]} alt={`preview-${i}`} width={120} height={90} style={{ objectFit: 'cover', borderRadius: 6 }} />
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  lineHeight: '18px',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" style={{ marginTop: '1rem' }}>Submit Post</button>
    </form>
  );
};

export default CreatePostForm;
