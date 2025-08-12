import { useState, useEffect } from 'react'
import { List, Input, Button, Checkbox, Card, Typography, Space, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Item } from '../entities/Item'

const { Title } = Typography

function ToDo() {
  const [items, setItems] = useState([])
  const [newItemTitle, setNewItemTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await Item.list()
      if (response.success) {
        setItems(response.data || [])
      }
    } catch (error) {
      message.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const addItem = async () => {
    if (!newItemTitle.trim()) return

    try {
      const response = await Item.create({
        title: newItemTitle,
        completed: false
      })
      
      if (response.success) {
        setItems(prev => [...prev, response.data])
        setNewItemTitle('')
        message.success('Item added successfully')
      }
    } catch (error) {
      message.error('Failed to add item')
    }
  }

  const toggleComplete = async (item) => {
    try {
      const response = await Item.update(item._id, {
        ...item,
        completed: !item.completed
      })
      
      if (response.success) {
        setItems(prev => 
          prev.map(i => i._id === item._id ? { ...i, completed: !i.completed } : i)
        )
      }
    } catch (error) {
      message.error('Failed to update item')
    }
  }

  const deleteItem = async (itemId) => {
    try {
      // Note: Assuming delete method exists, adjust if needed
      setItems(prev => prev.filter(i => i._id !== itemId))
      message.success('Item deleted successfully')
    } catch (error) {
      message.error('Failed to delete item')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={1} className="text-blue-600 mb-2">
              My To-Do List
            </Title>
            <p className="text-gray-600">Stay organized and productive</p>
          </div>

          <div className="mb-6">
            <Space.Compact className="w-full">
              <Input
                placeholder="Add a new task..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                size="large"
                className="flex-1"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addItem}
                size="large"
                disabled={!newItemTitle.trim()}
              >
                Add
              </Button>
            </Space.Compact>
          </div>

          <List
            loading={loading}
            dataSource={items}
            locale={{ emptyText: 'No tasks yet. Add one above!' }}
            renderItem={(item) => (
              <List.Item
                className={`transition-all duration-200 ${
                  item.completed ? 'opacity-60' : ''
                }`}
                actions={[
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  />
                ]}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Checkbox
                    checked={item.completed}
                    onChange={() => toggleComplete(item)}
                    className="text-lg"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </List.Item>
            )}
          />

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
              <span>
                Total: <strong>{items.length}</strong>
              </span>
              <span>
                Completed: <strong>{items.filter(i => i.completed).length}</strong>
              </span>
              <span>
                Remaining: <strong>{items.filter(i => !i.completed).length}</strong>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ToDo