import * as React from "react";
import "./style-sessions.css";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

/* ---> Define queries, mutations and fragments here */
const SPEAKER_ATTRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
    id
    name
    bio
    sessions {
      id
      title
    }
    featured
  }
`;

const SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;

const SPEAKER_BY_ID = gql`
  query speaker($id: ID!) {
    speakerById(id: $id) {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;

// When we return 'featured' which is the field we are modifying, Apollo will automatically update the cache and the page will reflect this change
const FEATURED_SPEAKER = gql`
  mutation toggleFeaturedSpeaker($speakerId:ID!, $featured: Boolean!) {
    markFeatured(speakerId:$speakerId, featured: $featured) {
      id
      featured
    }
  }
`;

const SpeakerList = () => {

  const { loading, error, data } = useQuery(SPEAKERS);
  const [toggleFeatured, featured] = useMutation(FEATURED_SPEAKER);

  if (loading) return <p>Loading Speakers...</p>;
  if (error) return <p>Error Loading Speakers!</p>;

  return data.speakers.map(({ id, name, bio, sessions, featured }) => (
		<div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{`Speaker: ${name}`}</h3>
        </div>
        <div className="panel-body">
          <h5>{`Bio: ${bio}`}</h5>
        </div>
        <div className="panel-footer">
          <h3 className="panel-title">{'Sessions'}</h3>
					{
            /* ---> Loop through speaker's sessions here */
            sessions.map(session => (
              <span key={session.id} style={{ padding: 2 }}>
                <p>{session.title}</p>
              </span>
            ))
					}
          <span>
            <button
              type="button"
              className="btn btn-default btn-lg"
              onClick={()=> {
                /* ---> Call useMutation's mutate function to mark speaker as featured */
                toggleFeatured({
                  variables: {
                    speakerId: id,
                    featured: !featured
                  }
                });
              }}
              >
                <i
                  className={`fa ${featured ? "fa-star" : "fa-star-o"}`}
                  aria-hidden="true"
                  style={{
                    color: featured ? "gold" : undefined,
                  }}
                ></i>{" "}
                Featured Speaker
            </button>
          </span>
        </div>
      </div>
    </div>
	))
};

const SpeakerDetails = () => {

  const { speaker_id } = useParams();
  const { loading, error, data } = useQuery(SPEAKER_BY_ID, {variables: { id: speaker_id }});

  if (loading) return <p>Loading Speaker...</p>;
  if (error) return <p>Error Loading Speaker!</p>;

  const speaker = data.speakerById;

  return (
    <div key={speaker.id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{speaker.name}</h3>
        </div>
        <div className="panel-body">
          <h5>{speaker.bio}</h5>
        </div>
        <div className="panel-footer">
          {
            /* ---> Loop through speaker's sessions here */
            speaker.sessions.map(session => (
              <div key={session.id}>
                <p>{session.title}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}


export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}


