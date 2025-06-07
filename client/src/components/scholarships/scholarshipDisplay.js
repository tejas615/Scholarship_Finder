import './styles.css';

export const ScholarshipDisplay = (props) => {
  const scholarships = props.state;

  if (!scholarships || scholarships.length === 0) {
    return <p className="no-data">There's nothing here yet.</p>;
  }

  return (
    <div className="cardContainer">
      {scholarships.map((scholarship) => (
        <div key={scholarship._id} className="card">
          <div className="apply">
            <form className="button" action={scholarship.website} target="_blank" rel="noopener noreferrer">
              <input className="btn" type="submit" value="Apply Now" />
            </form>
          </div>  

          <div className="header">
            {scholarship.title}
          </div>

          <div className="eligibility">
            <strong>Eligibility:</strong><br />{scholarship.eligibility || 'N/A'}
          </div>

          <div className="award">
            <strong>Amount:</strong> {scholarship.award || 'N/A'}
          </div>

          <div className="deadline">
            <strong>Deadline:</strong> {scholarship.deadline || 'TBD'}
          </div>

          <div className="description">
            <strong>Description:</strong><br />{scholarship.description || 'No description available.'}
          </div>
        </div>
      ))}
    </div>
  );
};
