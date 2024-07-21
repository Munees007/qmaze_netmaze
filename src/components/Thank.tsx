import React from "react";

const Thank = () =>{
    return(
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-semibold mb-4">Welcome and Thank You!</h2>
          <p className="mb-4">Dear Participants,</p>
          <p className="mb-4">Thank you for joining us today for this exciting word wizard game event! We are thrilled to have you here and hope you enjoyed the challenges and fun we had prepared for you.</p>
          <h3 className="text-xl font-semibold mb-2">Credits</h3>
          <p className="mb-4">This word search game was created by Munees and organized by the III BCA B students. We would like to extend our special thanks to our seniors and the faculty members for their invaluable support and guidance. A heartfelt thank you to our Head of Department for approving and encouraging this event.</p>
          <p>We appreciate your participation and enthusiasm. We hope to see you in future events!</p>
          <p className="mt-4">Best regards, <br /> P. Muneeswaran  <br/> R. Karthik Balan <br /> III BCA B Students</p>
        </div>
      </div>
    )
}

export default Thank;