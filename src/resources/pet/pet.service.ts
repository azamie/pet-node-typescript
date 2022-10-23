import PetModel from '@/resources/pet/pet.model';
import Pet from '@/resources/pet/pet.interface';

class PetService {
  private pet = PetModel;

  /**
   *  Create a new pet
   */
  public async create(
    name: string,
    description: string,
    imgURL: string
  ): Promise<Pet> {
    try {
      const pet = await this.pet.create({ name, description, imgURL });

      return pet;
    } catch (error) {
      throw new Error('Unable to create pet');
    }
  }

  /**
   *  Fetch pet list
   */
  public async getPets(): Promise<Pet[]> {
    try {
      const petList = await this.pet.find();

      return petList;
    } catch (error) {
      throw new Error('Unable to fetch pet list');
    }
  }

  /**
   *  Fetch a pet information
   */
  public async getPet(id: string): Promise<Pet|null> {
    try {
      const petList = await this.pet.findOne({_id: id});

      return petList;
    } catch (error) {
      throw new Error('Unable to fetch the pet');
    }
  }

  /**
   *  Update a pet
   */
  public async update(
    id: string,
    name: string,
    description: string,
    imgURL: string
  ): Promise<void> {
    try {
      const updatedPet = { _id: id, name, description, imgURL };
      await this.pet.findByIdAndUpdate(id, updatedPet, { new: true });
    } catch (error) {
      throw new Error(`Unable to udpate the pet with id=${id}`);
    }
  }

  /**
   *  Delete a pet
   */
  public async delete(id: string): Promise<void> {
    try {
      await this.pet.findByIdAndRemove(id);
    } catch (error) {
      throw new Error(`Unable to delete the pet with id=${id}`);
    }
  }
}

export default PetService;
