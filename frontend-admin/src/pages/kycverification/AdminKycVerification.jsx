// import { useState } from "react";
// import {
//   Eye,
//   X,
//   CheckCircle,
//   AlertTriangle,
//   XCircle,
// } from "lucide-react";
// import "./AdminKycVerification.css";
//
// const AdminKycVerification = () => {
//   const [activeTab, setActiveTab] = useState("PENDING");
//   const [search, setSearch] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showRejectBox, setShowRejectBox] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");
//   const [previewDoc, setPreviewDoc] = useState(null);
//
//   const [kycList, setKycList] = useState([
//     {
//       id: 1,
//       username: "Meera Nair",
//       email: "meera.nair@example.com",
//       phone: "+91 98765 43210",
//       panId: "ABCDE1234F",
//       aadharId: "XXXX-XXXX-8899",
//       status: "PENDING",
//     },
//   ]);
//
//   const filtered = kycList.filter(
//     (u) =>
//       u.status === activeTab &&
//       u.username.toLowerCase().includes(search.toLowerCase())
//   );
//
//   const approveUser = () => {
//     setKycList((prev) =>
//       prev.map((u) =>
//         u.id === selectedUser.id ? { ...u, status: "VERIFIED" } : u
//       )
//     );
//     setSelectedUser(null);
//   };
//
//   const rejectUser = () => {
//     if (!rejectReason.trim()) return;
//
//     setKycList((prev) =>
//       prev.filter((u) => u.id !== selectedUser.id)
//     );
//
//     setSelectedUser(null);
//     setShowRejectBox(false);
//     setRejectReason("");
//   };
//
//   return (
//     <div className="kyc-wrapper">
//       <h1>KYC Verification</h1>
//       <p className="subtitle">
//         Review and manage customer KYC submissions
//       </p>
//
//       {/* TOP CARDS */}
//       <div className="kyc-cards">
//         <div
//           className={`kyc-card blue ${
//             activeTab === "PENDING" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("PENDING")}
//         >
//           Pending
//         </div>
//
//         <div
//           className={`kyc-card green ${
//             activeTab === "VERIFIED" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("VERIFIED")}
//         >
//           Verified
//         </div>
//       </div>
//
//       {/* SEARCH */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search by username..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//
//       {/* TABLE */}
//       <div className="table-card">
//         <table>
//           <thead>
//             <tr>
//               <th>User Name</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.username}</td>
//                 <td>
//                   <span
//                     className={`status-badge ${
//                       user.status === "PENDING"
//                         ? "pending"
//                         : "verified"
//                     }`}
//                   >
//                     {user.status}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     className="review-btn"
//                     onClick={() => setSelectedUser(user)}
//                   >
//                     <Eye size={16} /> Review
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//
//       {/* MAIN MODAL */}
//       {selectedUser && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-header">
//               <div>
//                 <h2>KYC Review</h2>
//                 <p className="username">{selectedUser.username}</p>
//               </div>
//               <X
//                 size={22}
//                 className="close-icon"
//                 onClick={() => setSelectedUser(null)}
//               />
//             </div>
//
//             <div className="modal-body">
//
//               {/* Applicant Info */}
//               <div className="info-card">
//                 <h3>Applicant Information</h3>
//                 <div className="info-grid">
//                   <div>
//                     <label>Email</label>
//                     <p>{selectedUser.email}</p>
//                   </div>
//                   <div>
//                     <label>Phone</label>
//                     <p>{selectedUser.phone}</p>
//                   </div>
//                   <div>
//                     <label>PAN ID</label>
//                     <p>{selectedUser.panId}</p>
//                   </div>
//                   <div>
//                     <label>Aadhar</label>
//                     <p>{selectedUser.aadharId}</p>
//                   </div>
//                 </div>
//               </div>
//
//               {/* Uploaded Documents */}
//               <div className="info-card">
//                 <h3>Uploaded Documents</h3>
//                 <div className="doc-row">
//                   <button
//                     className="doc-btn blue"
//                     onClick={() => setPreviewDoc("AADHAR")}
//                   >
//                     <Eye size={16} /> Aadhaar Card
//                   </button>
//
//                   <button
//                     className="doc-btn green"
//                     onClick={() => setPreviewDoc("PAN")}
//                   >
//                     <Eye size={16} /> PAN Card
//                   </button>
//                 </div>
//               </div>
//
//               {/* Decision Section */}
//               <div className="decision-card">
//                 <h3>MAKE YOUR DECISION</h3>
//
//                 <div className="decision-buttons">
//                   <button
//                     className="decision approve"
//                     onClick={approveUser}
//                   >
//                     <CheckCircle size={20} />
//                     <div>
//                       <span>Approve</span>
//                       <small>Mark as Verified</small>
//                     </div>
//                   </button>
//
//                   <button className="decision manual">
//                     <AlertTriangle size={20} />
//                     <div>
//                       <span>Manual</span>
//                       <small>Needs verification</small>
//                     </div>
//                   </button>
//
//                   <button
//                     className="decision reject"
//                     onClick={() => setShowRejectBox(true)}
//                   >
//                     <XCircle size={20} />
//                     <div>
//                       <span>Reject</span>
//                       <small>Provide reason</small>
//                     </div>
//                   </button>
//                 </div>
//
//                 {showRejectBox && (
//                   <div className="reject-panel">
//                     <textarea
//                       placeholder="Enter rejection reason..."
//                       value={rejectReason}
//                       onChange={(e) =>
//                         setRejectReason(e.target.value)
//                       }
//                     />
//                     <div className="reject-actions">
//                       <button
//                         className="cancel-btn"
//                         onClick={() => setShowRejectBox(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="confirm-btn"
//                         onClick={rejectUser}
//                       >
//                         Confirm
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//
//             </div>
//           </div>
//         </div>
//       )}
//
//       {/* PDF PREVIEW POPUP */}
//       {previewDoc && (
//         <div className="pdf-overlay">
//           <div className="pdf-modal">
//             <div className="pdf-header">
//               <h3>
//                 {previewDoc === "AADHAR"
//                   ? "Aadhaar Card"
//                   : "PAN Card"}{" "}
//                 Preview
//               </h3>
//               <X
//                 size={22}
//                 className="close-icon"
//                 onClick={() => setPreviewDoc(null)}
//               />
//             </div>
//
//             <div className="pdf-body">
//               <iframe
//                 src={
//                   previewDoc === "AADHAR"
//                     ? "/sample-aadhaar.pdf"
//                     : "/sample-pan.pdf"
//                 }
//                 title="Document Preview"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default AdminKycVerification;
import { useState, useEffect } from "react";
import {
  Eye,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  getPendingKycs,
  approveKyc,
  rejectKyc,
} from "../../api/kycApi";
import "./AdminKycVerification.css";

const AdminKycVerification = () => {
  const [activeTab, setActiveTab] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycs();
  }, []);

  const fetchKycs = async () => {
    try {
      const res = await getPendingKycs();
      setKycList(res.data);
    } catch (err) {
      console.error("Failed to fetch KYCs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = kycList.filter(
    (u) =>
      u.status === activeTab &&
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const approveUser = async () => {
    try {
      await approveKyc(selectedUser.userId);
      fetchKycs();
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const rejectUser = async () => {
    if (!rejectReason.trim()) return;

    try {
      await rejectKyc(selectedUser.userId, rejectReason);
      fetchKycs();
      setSelectedUser(null);
      setShowRejectBox(false);
      setRejectReason("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div className="kyc-wrapper">
      <h1>KYC Verification</h1>
      <p className="subtitle">
        Review and manage customer KYC submissions
      </p>

      {/* TOP CARDS */}
{/*       <div className="kyc-cards"> */}
{/*         <div */}
{/*           className={`kyc-card blue ${ */}
{/*             activeTab === "PENDING" ? "active" : "" */}
{/*           }`} */}
{/*           onClick={() => setActiveTab("PENDING")} */}
{/*         > */}
{/*           Pending */}
{/*         </div> */}

{/*         <div */}
{/*           className={`kyc-card green ${ */}
{/*             activeTab === "VERIFIED" ? "active" : "" */}
{/*           }`} */}
{/*           onClick={() => setActiveTab("VERIFIED")} */}
{/*         > */}
{/*           Verified */}
{/*         </div> */}
{/*       </div> */}

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.userId}>
                <td>{user.fullName}</td>
                <td>
                  <span
                    className={`status-badge ${
                      user.status === "PENDING"
                        ? "pending"
                        : "verified"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <button
                    className="review-btn"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye size={16} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REVIEW MODAL */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h2>KYC Review</h2>
                <p className="username">{selectedUser.fullName}</p>
              </div>
              <X
                size={22}
                className="close-icon"
                onClick={() => setSelectedUser(null)}
              />
            </div>

            <div className="modal-body">

              {/* Applicant Info */}
              <div className="info-card">
                <h3>Applicant Information</h3>
                <div className="info-grid">
                  <div>
                    <label>Email</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <label>PAN ID</label>
                    <p>{selectedUser.panNumber}</p>
                  </div>
                  <div>
                    <label>Aadhaar</label>
                    <p>{selectedUser.aadhaarNumber}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="info-card">
                <h3>Uploaded Documents</h3>
                <div className="doc-row">
                  <button
                    className="doc-btn blue"
                    onClick={() => setPreviewDoc("AADHAR")}
                  >
                    <Eye size={16} /> Aadhaar Card
                  </button>

                  <button
                    className="doc-btn green"
                    onClick={() => setPreviewDoc("PAN")}
                  >
                    <Eye size={16} /> PAN Card
                  </button>
                </div>
              </div>

              {/* Decision */}
              <div className="decision-card">
                <h3>MAKE YOUR DECISION</h3>

                <div className="decision-buttons">
                  <button
                    className="decision approve"
                    onClick={approveUser}
                  >
                    <CheckCircle size={20} />
                    <div>
                      <span>Approve</span>
                      <small>Mark as Verified</small>
                    </div>
                  </button>

                  <button
                    className="decision reject"
                    onClick={() => setShowRejectBox(true)}
                  >
                    <XCircle size={20} />
                    <div>
                      <span>Reject</span>
                      <small>Provide reason</small>
                    </div>
                  </button>
                </div>

                {showRejectBox && (
                  <div className="reject-panel">
                    <textarea
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={(e) =>
                        setRejectReason(e.target.value)
                      }
                    />
                    <div className="reject-actions">
                      <button
                        className="cancel-btn"
                        onClick={() => setShowRejectBox(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="confirm-btn"
                        onClick={rejectUser}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PDF Preview */}
      {previewDoc && (
        <div className="pdf-overlay">
          <div className="pdf-modal">
            <div className="pdf-header">
              <h3>
                {previewDoc === "AADHAR"
                  ? "Aadhaar Card"
                  : "PAN Card"} Preview
              </h3>
              <X
                size={22}
                className="close-icon"
                onClick={() => setPreviewDoc(null)}
              />
            </div>
            <div className="pdf-body">
              <iframe
                src="/sample-doc.pdf"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKycVerification;
