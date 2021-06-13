interface Course {
  name: string;
  duration: number;
  educator: string;
}

class CreateCourseService {
  execute({ duration, educator, name }: Course) {
    console.log(`Nome: ${name}; Duração: ${duration}; Professor: ${educator}`);
  }
}

export default CreateCourseService;
