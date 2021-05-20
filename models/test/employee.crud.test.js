const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
    before(async () => {
      try {
        const fakeDB = new MongoMemoryServer();
        const uri = await fakeDB.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      } catch (err) {
        console.log(err);
      }
    });
  
    describe('Reading data', () => {
      let depId;
      before(async () => {
        const testDep = new Department({ name: 'Testing '});
        const savedDep = await testDep.save();
        depId = savedDep._id;
  
        const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'Test1', department: depId });
        await testEmpOne.save();
  
        const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'Test2', department: depId });
        await testEmpTwo.save();
      });
  
      after(async () => {
        await Employee.deleteMany();
      });
  
      it('should return all the data with "find" method', async () => {
        const employees = await Employee.find();
        const expectedLength = 2;
        expect(employees.length).to.be.equal(expectedLength);
      });
  
      it('should contain department document after populate method', async () => {
          const employees = await Employee.find().populate('department');
          for (emp of employees) {
            emp.department.validate(err => {
              expect(err).to.not.exist;
            });
          }
      });
  
      it('should return proper document by various params with "findOne" method', async () => {
        const expectedEmployee = { firstName: 'Employee #1', lastName: 'Test1', department: depId};
        for (let key in expectedEmployee) {
          const value = expectedEmployee[key];
          const employee = await Employee.findOne({ [key]: value });
          expect(employee.firstName).to.be.equal(expectedEmployee.firstName);
        }
      });
    });
  
    describe('Creating data', () => {
      after(async () => {
        await Employee.deleteMany();
      });
  
      it('should insert new document with "insertOne" method', async () => {
        const employee = new Employee({ firstName: 'Employee #1', lastName: 'Test', department: 'Test' });
        await employee.save();
        expect(employee.isNew).to.be.false;
      });
    });
  
    describe('Updating data', () => {
      beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'Test', department: 'Test' });
        await testEmpOne.save();
  
        const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'Test', department: 'Test' });
        await testEmpTwo.save();
      });
  
      afterEach(async () => {
        await Employee.deleteMany();
      });
  
      it('should properly update one document with "updateOne" method', async () => {
        await Employee.updateOne({ firstName: 'Employee #1' }, { $set: { firstName: '=Employee #1=' } });
        const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
        expect(updatedEmployee).to.not.be.null;
      });
  
      it('should properly update one document with "save" method', async () => {
        const employee = await Employee.findOne({ firstName: 'Employee #1' });
        employee.firstName = '=Employee #1=';
        await employee.save();
  
        const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
        expect(updatedEmployee).to.not.be.null;
      });
  
      it('should properly update multiple documents with "updateMany" method', async () => {
        await Employee.updateMany({}, { $set: { firstName: 'Updated Employee' } });
        const updatedEmps = await Employee.find({ firstName: 'Updated Employee' });
        expect(updatedEmps.length).to.be.equal(2);
      });
    });
  
    describe('Removing data', () => {
      beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'Employee #1', lastName: 'Test', department: 'Test' });
        await testEmpOne.save();
  
        const testEmpTwo = new Employee({ firstName: 'Employee #2', lastName: 'Test', department: 'Test' });
        await testEmpTwo.save();
      });
  
      afterEach(async () => {
        await Employee.deleteMany();
      });
  
      it('should properly remove one document with "deleteOne" method', async () => {
        await Employee.deleteOne({ firstName: 'Employee #1' });
        const emp = await Employee.findOne({ firstName: 'Employee #1' });
        expect(emp).to.be.null;
      });
  
      it('should properly remove one document with "remove" method', async () => {
        const employee = await Employee.findOne({ firstName: 'Employee #1' });
        await employee.remove();
        const removedEmployee = await Employee.findOne({ firstName: 'Employee #1' });
        expect(removedEmployee).to.be.null;
      });
  
      it('should properly remove multiple documents with "deleteMany" method', async () => {
        await Employee.deleteMany();
        const employees = await Employee.find();
        expect(employees.length).to.equal(0);
      });
    });
  });