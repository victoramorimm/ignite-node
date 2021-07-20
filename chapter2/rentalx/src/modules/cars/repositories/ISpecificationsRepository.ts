import { Specification } from "../entities/Specification";

interface ICreateSpeficicationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateSpeficicationDTO): void;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ICreateSpeficicationDTO };
