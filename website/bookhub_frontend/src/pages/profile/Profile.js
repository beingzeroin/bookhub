import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "./Card";
import "./Profile.css";
import Navbar from "../main/navbar/navbar";
import defaultIcon from "./default-user-icon.jpg";
// import Sidebar from "../main/sidebar/sidebar";

class Profile extends Component {
  state = {
    user: null,
    profile_picture: null,
    email: null,
    listings: []
  };

  componentDidMount() {
    const { handle } = this.props.match.params;

    fetch(`http://localhost:4000/profile?email=${handle}`) // user info
      .then(res => res.json())
      .then(data => {
        this.setState({
          user: data[0].username,
          email: data[0].email
        });
      });
    fetch(`http://localhost:4000/userListings?email=${handle}`) // user listings
      .then(res => res.json())
      .then(data => {
        this.setState({
          listings: data
        });
      });
  }

  render() {
    let { user, listings, email, profile_picture } = this.state;

    // if user has no profile picture use default
    if (!profile_picture) {
      profile_picture = defaultIcon;
    }

    const profileListings = listings.map(listing => {
      return (
        <div className="col-md-4 pb-3" key={listing.list_id}>
          <Card bookTitle={listing.title} bookPrice={listing.price} />
        </div>
      );
    });

    return (
      <div>
        <Navbar />
        {/* <Sidebar /> */}
        <div className="Top">
          <header class="page-cover">
            <div class="text-center">
              <img
                src={profile_picture}
                width="140"
                height="140"
                border="0"
                class="rounded-circle"
              />
              <h2 class="h4 mt-2 mb-0">{user}</h2>
              <p class="text-muted">{email}</p>
              <button class="btn btn-primary" type="submit">
                Message
              </button>
            </div>
          </header>
        </div>
        <div class="Inner">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active" aria-current="page">
                <strong>{user}'s Active Listings</strong>
              </li>
            </ol>
          </nav>
          <div class="album py-3">
            <div class="container">
              <div class="row">{profileListings}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;