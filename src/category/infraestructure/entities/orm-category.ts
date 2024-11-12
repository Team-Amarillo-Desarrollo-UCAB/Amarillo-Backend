import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
//import { OrmProduct } from 'src/product/infrastructure/entities/orm-entities/orm-product';

@Entity({ name: 'category' })
export class OrmCategory {
  @PrimaryColumn({ type: 'uuid' })
  id: string; // ID de tipo UUID, clave primaria

  @Column('varchar', { length: 100 })
  categoryName: string; // Nombre de la categoría

  @Column({ type: 'varchar', nullable: true })
  icon: string; // Icono de la categoría

  // Relación muchos a muchos con productos
//   @ManyToMany(() => OrmProduct, (product) => product.categories)
//   @JoinTable({ name: 'category_product' }) // Tabla de unión
//   products: OrmProduct[];

  // Método estático para crear una instancia de categoría
  static create(
    id: string,
    categoryName: string,
    icon: string,
    //products: OrmProduct[];
  ): OrmCategory {
    const category = new OrmCategory();
    category.id = id;
    category.categoryName = categoryName;
    category.icon = icon;
    //category.products=products
    return category;
  }
}
