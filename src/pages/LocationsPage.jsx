import { useReveal } from '../hooks/useReveal';

const LocationsPage = () => {
  // Reveal animation refs
  const card1Ref = useReveal();
  const card2Ref = useReveal();
  const card3Ref = useReveal();
  const locations = [
    {
      id: 1,
      name: "Main Branch — Downtown",
      address: "123 Coffee St., Barangay Central, City",
      phone: "+63 912 345 6789",
      hours: "Mon–Sun, 7:00 AM – 9:00 PM",
      image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "North Branch — Uptown",
      address: "45 Brew Ave., Barangay Norte, City",
      phone: "+63 998 765 4321",
      hours: "Mon–Sun, 7:00 AM – 9:00 PM",
      image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "East Branch — Riverside",
      address: "78 Latte Blvd., Barangay Silangan, City",
      phone: "+63 922 334 4556",
      hours: "Mon–Sun, 7:00 AM – 9:00 PM",
      image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <>
      {/* Locations Page */}
      <section className="featured" style={{paddingTop: '30px'}}>
        <div className="container">
          <div className="section-head">
            <h2>Our Branches</h2>
            <p>Find a No Cap cafe near you</p>
          </div>

          <div className="featured-grid">
            <div className="featured-card reveal" ref={card1Ref}>
              <img src={locations[0].image} alt={locations[0].name} />
              <div className="card-body">
                <h3>{locations[0].name}</h3>
                <span className="pill">{locations[0].hours}</span>
                <p className="desc">{locations[0].address}</p>
                <p className="desc">Phone: <a href={`tel:${locations[0].phone}`}>{locations[0].phone}</a></p>
              </div>
            </div>

            <div className="featured-card reveal" ref={card2Ref}>
              <img src={locations[1].image} alt={locations[1].name} />
              <div className="card-body">
                <h3>{locations[1].name}</h3>
                <span className="pill">{locations[1].hours}</span>
                <p className="desc">{locations[1].address}</p>
                <p className="desc">Phone: <a href={`tel:${locations[1].phone}`}>{locations[1].phone}</a></p>
              </div>
            </div>

            <div className="featured-card reveal" ref={card3Ref}>
              <img src={locations[2].image} alt={locations[2].name} />
              <div className="card-body">
                <h3>{locations[2].name}</h3>
                <span className="pill">{locations[2].hours}</span>
                <p className="desc">{locations[2].address}</p>
                <p className="desc">Phone: <a href={`tel:${locations[2].phone}`}>{locations[2].phone}</a></p>
              </div>
            </div>
          </div>

          <div className="cta-center">
            <a href="/menu" className="btn">Order for Pickup</a>
          </div>
        </div>
      </section>

      {/* Simple Map Section */}
      <section className="features">
        <div className="container">
          <div className="section-head">
            <h2>Map & Directions</h2>
            <p>Coming soon: live map and branch availability</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default LocationsPage;
