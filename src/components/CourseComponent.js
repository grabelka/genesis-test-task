function CourseComponent(props) {
  return (
    <div className="border border-ligft rounded p-3 mt-3 shadow">
      <h3 className="display-5">{props.item.title}</h3>
      <div className="course-info">
        <img className="course-img" src={`${props.item.previewImageLink}/cover.webp`} alt="Course"/>
        <div>
          <p className="course-description"><i>{props.item.description}</i></p>
          {Array.isArray(props.item.tags) && <div className='mb-3'>
              {props.item.tags.map((item) => (
                  <span className='badge bg-success' key={item}>
                    {item}
                  </span>
                ))}
              </div>}
            {Array.isArray(props.item.meta.skills) && <>
            <p><b>Skills: </b></p>
            <ul>
              {props.item.meta.skills.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </>
          }
          <p><b>Lessons count:</b> {props.item.lessonsCount}</p>
          <p><b>Rating:</b> {props.item.rating}</p>
        </div>
      </div>
    </div>
  );
}

export default CourseComponent;