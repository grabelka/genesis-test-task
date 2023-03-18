import CoursesList from "../components/CoursesList"
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <h1 className="display-1"><b>Last Courses</b></h1>
      <CoursesList />
      <Footer />
    </div>
  );
};

export default Home;
