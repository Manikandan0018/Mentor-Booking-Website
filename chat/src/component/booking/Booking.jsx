import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import heroBg from "../../image/background1.png";

const Booking = () => {
  const { id } = useParams(); // mentor ID
  const location = useLocation();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [bookedServices, setBookedServices] = useState([]);

  const query = new URLSearchParams(location.search);
  const selectedService = query.get("service");

  // Fetch mentor details
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/getMentor/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch mentor");
        const data = await res.json();
        setMentor(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMentor();
  }, [id]);

  // Check already booked services
  useEffect(() => {
    if (!mentor) return;

    const checkBooked = async () => {
      const services = [
        mentor.service_15min,
        mentor.service_chat,
        mentor.service_fulltime,
      ].filter((s) => s && s.title);

      try {
        const bookedResults = await Promise.all(
          services.map(async (service) => {
            const res = await fetch(
              `http://localhost:5000/api/bookings/check/${mentor._id}/${service.title}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const data = await res.json();
            return data.alreadyBooked ? service.title : null;
          })
        );

        setBookedServices(bookedResults.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    checkBooked();
  }, [mentor]);

  if (!mentor) {
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        Loading mentor...
      </p>
    );
  }

  const services = [
    mentor.service_15min,
    mentor.service_chat,
    mentor.service_fulltime,
  ].filter((s) => s && s.title);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-16 px-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="max-w-5xl w-full">
        {/* Mentor Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {mentor.name}
          </h2>
          {mentor.qualification && (
            <p>
              <b>Qualification:</b> {mentor.qualification}
            </p>
          )}
          {mentor.experience && (
            <p>
              <b>Experience:</b> {mentor.experience}
            </p>
          )}
          {mentor.skills?.length > 0 && (
            <p>
              <b>Skills:</b> {mentor.skills.join(", ")}
            </p>
          )}
        </div>

        {/* Services */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Available Services
        </h3>
        {services.length === 0 ? (
          <p className="text-center text-gray-600">No services available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition transform hover:-translate-y-2 hover:shadow-lg ${
                  selectedService === service.title
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h4 className="text-xl font-semibold">{service.title}</h4>
                {service.description && (
                  <p className="text-gray-700">{service.description}</p>
                )}
                <p className="text-2xl font-bold text-blue-600">
                  {service.price}
                </p>
                <button
                  disabled={bookedServices.includes(service.title)}
                  onClick={() =>
                    navigate(
                      `/mentorDateBooking/${mentor._id}?service=${service.title}`
                    )
                  }
                  className={`mt-4 w-full py-2 rounded-xl transition ${
                    bookedServices.includes(service.title)
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {bookedServices.includes(service.title)
                    ? "Already Booked"
                    : "Book Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
