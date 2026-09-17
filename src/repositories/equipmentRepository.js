import { randomUUID } from 'node:crypto';

const equipmentItems = [];

const copyEquipment = (equipment) => (equipment ? { ...equipment } : null);

const equipmentRepository = {
  async findAll() {
    return equipmentItems.map(copyEquipment);
  },

  async findById(id) {
    const equipment = equipmentItems.find((item) => item.id === id);

    return copyEquipment(equipment);
  },

  async create(data) {
    const equipment = {
      id: randomUUID(),
      ...data,
    };

    equipmentItems.push(equipment);

    return copyEquipment(equipment);
  },

  async update(id, data) {
    const equipmentIndex = equipmentItems.findIndex((item) => item.id === id);

    if (equipmentIndex === -1) {
      return null;
    }

    const updatedEquipment = {
      ...equipmentItems[equipmentIndex],
      ...data,
      id,
    };

    equipmentItems[equipmentIndex] = updatedEquipment;

    return copyEquipment(updatedEquipment);
  },

  async delete(id) {
    const equipmentIndex = equipmentItems.findIndex((item) => item.id === id);

    if (equipmentIndex === -1) {
      return null;
    }

    const [deletedEquipment] = equipmentItems.splice(equipmentIndex, 1);

    return copyEquipment(deletedEquipment);
  },
};

export default equipmentRepository;
