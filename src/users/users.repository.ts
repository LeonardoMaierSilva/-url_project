import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUserById(id: number): Promise<User | null> {
    return await this.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return await this.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await this.update(id, userData);
    return this.findUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected ? true : false;
  }
}
