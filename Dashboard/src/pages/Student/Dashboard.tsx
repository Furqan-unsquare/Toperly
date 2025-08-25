import RecommendedCourses from '../../components/student/RecommendedCourses'
import TopPick from '../../components/student/TopPick'
import TopRatedCourses from '../../components/student/TopRatedCourses'
import HeroSection from '../../components/student/HeroSection'

const StudentsMainPage = () => {
  return (
    <div>
      <HeroSection/>
      <RecommendedCourses/>
      <TopPick/>
      <TopRatedCourses/>
    </div>
  )
}

export default StudentsMainPage