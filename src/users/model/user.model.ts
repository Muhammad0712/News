import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { News } from "../../news/model/news.model";

interface IUserCreationAttr {
    email: string;
    password: string;
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User, IUserCreationAttr> { 
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare refreshToken: string;

    @HasMany(()=> News)
    news: News[];
}
