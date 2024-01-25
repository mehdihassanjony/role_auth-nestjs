import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  findMany() {
    return this.orderModel
      .find()
      .populate('customer')
      .populate('products')
      .exec();
  }

  async findById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('customer')
      .populate('products')
      .exec();

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return order;
  }

  async findManyByCustomer(customerId: string) {
    return await this.orderModel
      .find({ customer: customerId })
      .populate('customer')
      .populate('products')
      .exec();
  }

  create(payload: CreateOrderDto) {
    const newOrder = new this.orderModel(payload);

    return newOrder.save();
  }

  async update(id: string, payload: UpdateOrderDto) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .populate('customer')
      .populate('products')
      .exec();

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return order;
  }

  async remove(id: string) {
    this.findById(id);

    return this.orderModel
      .findByIdAndDelete(id)
      .populate('customer')
      .populate('products')
      .exec();
  }

  async removeProduct(id: string, productId: string) {
    const order = await this.orderModel.findById(id).exec();
    order.products.pull(productId);

    return order.save();
  }

  async addProduct(id: string, productsIds: string[]) {
    const order = await this.orderModel.findById(id).exec();
    productsIds.forEach((productId) => order.products.push(productId));

    return order.save();
  }
}
