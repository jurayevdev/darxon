import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { Category } from './models/category.model';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private repo: typeof Category,
    private readonly fileService: FilesService,
  ) {}

  async create(createDto: CategoryCreateDto, image: any) {
    if (image) {
      let image_name: string;
      try {
        image_name = await this.fileService.createFile(image);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      const category = await this.repo.create({
        image: image_name,
        ...createDto,
      });
      return {
        message: 'Category created',
        category: category,
      };
    }
  }

  async getAll() {
    const categories = await this.repo.findAll({ include: { all: true } });
    
    categories.forEach(category => {
      if (category.menu && Array.isArray(category.menu)) {
        category.menu.sort((a, b) => {
          return (a.type === b.type) ? 0 : a.type ? -1 : 1;
        });
      }
    });
  
    return categories;
  }
  

  async getOne(id: number): Promise<Category> {
    const category = await this.repo.findByPk(id);
    return category;
  }

  async delOne(id: number) {
    let category = await this.repo.findOne({ where: { id } });
    await this.repo.destroy({ where: { id } });

    if (category.image !== 'null') {
      try {
        await this.fileService.deleteFile(category.image);
      } catch (error) {
        console.log(error);
      }
    }
    return {
      message: 'Category deleted',
    };
  }

  async update(id: number, updateDto: CategoryUpdateDto, image: any) {
    if (image) {
      let image_name: string;
      let oldCategoryImage = await this.repo.findOne({ where: { id } });
      try {
        if (oldCategoryImage.image !== 'null') {
          try {
            await this.fileService.deleteFile(oldCategoryImage.image);
          } catch (error) {
            console.log(error);
          }
        }
        image_name = await this.fileService.createFile(image);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      const category = await this.repo.update(
        {
          image: image_name,
          ...updateDto,
        },
        { where: { id } },
      );
      return {
        message: 'Category updated',
        category: category,
      };
    }
    const category = await this.repo.update(updateDto, {
      where: { id },
    });
    return {
      message: 'Category updated',
      category: category,
    };
  }
}
